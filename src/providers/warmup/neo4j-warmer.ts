import {
  Inject,
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { NestNeo4jProvider, NEST_NEO4J_PROVIDER } from '@volontariapp/bridge-nest';
import {
  EventPostLinkService,
  ParticipationService,
  RelationshipService,
} from '@volontariapp/domain-social';
import { Logger } from '@volontariapp/logger';
import { buildNeo4jWarmupQueries, type Neo4jWarmupQuery } from './neo4j-warmup.queries.js';

/** Hot reads run this many at a time: enough to open connections, gentle on a cold Neo4j. */
export const NEO4J_WARMUP_CONCURRENCY = 8;

/** Connections opened in parallel at the end of each round, so a burst finds them in the pool. */
export const NEO4J_WARMUP_CONNECTIONS = 16;

/**
 * Every 5 minutes: idle connections are checked and replaced before they expire, and a plan
 * that Neo4j wants to replan (statistics drift) is replanned here rather than under a burst.
 */
export const NEO4J_WARMUP_INTERVAL_MS = 5 * 60 * 1000;

/** The startup round delays readiness (HTTP /health listens after it); a slow Neo4j must not block it. */
export const NEO4J_WARMUP_STARTUP_BUDGET_MS = 15_000;

/**
 * Neo4j is probed this often (verifyConnectivity) to see it come back after a restart: its
 * restart takes about 20 s, so a 5 s probe sees it down at least once.
 */
export const NEO4J_HEALTH_POLL_INTERVAL_MS = 5_000;

/**
 * While the warm-up that follows a Neo4j restart runs, readiness answers 503 so that the
 * gateway gets fast errors instead of piling requests on a cold Neo4j. Past this cap the pod is
 * ready again even if the warm-up has not finished, so it never stays out of service.
 */
export const NEO4J_RECOVERY_READINESS_CAP_MS = 30_000;

export interface Neo4jWarmupReport {
  queries: number;
  failures: number;
  durationMs: number;
}

/**
 * Replays the hot Cypher reads with identifiers that match nothing, at startup and periodically.
 * After hours without traffic, the first burst otherwise lands on cold plans and an empty pool.
 */
@Injectable()
export class Neo4jWarmer implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger({ context: Neo4jWarmer.name, format: 'json' });
  private readonly queries: Neo4jWarmupQuery[];
  private timer: NodeJS.Timeout | null = null;
  private healthTimer: NodeJS.Timeout | null = null;
  private running: Promise<Neo4jWarmupReport> | null = null;
  private started = false;
  private neo4jDown = false;
  private probing = false;
  private recoveringSince: number | null = null;

  constructor(
    @Inject(NEST_NEO4J_PROVIDER)
    private readonly neo4jProvider: NestNeo4jProvider,
    participation: ParticipationService,
    relationship: RelationshipService,
    eventPostLink: EventPostLinkService,
  ) {
    this.queries = buildNeo4jWarmupQueries({ participation, relationship, eventPostLink });
  }

  async onApplicationBootstrap(): Promise<void> {
    // A hybrid app (gRPC microservice plus HTTP) can run the bootstrap hooks more than once.
    if (this.started) return;
    this.started = true;

    const report = await this.withBudget(this.warm(), NEO4J_WARMUP_STARTUP_BUDGET_MS);
    if (report === null) {
      this.logger.warn('Neo4j warm-up still running after the startup budget, serving anyway', {
        budgetMs: NEO4J_WARMUP_STARTUP_BUDGET_MS,
      });
    } else {
      this.logger.info('Neo4j warm-up done', { ...report });
    }

    this.timer = setInterval(() => {
      void this.warm().then((periodic) => {
        this.logger.debug('Neo4j periodic warm-up done', { ...periodic });
      });
    }, NEO4J_WARMUP_INTERVAL_MS);
    this.timer.unref();

    this.healthTimer = setInterval(() => {
      void this.probeNeo4j();
    }, NEO4J_HEALTH_POLL_INTERVAL_MS);
    this.healthTimer.unref();
  }

  onApplicationShutdown(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.healthTimer !== null) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
  }

  /** False while the warm-up after a Neo4j restart runs, for at most the readiness cap. */
  isReady(): boolean {
    if (this.recoveringSince === null) return true;
    return Date.now() - this.recoveringSince >= NEO4J_RECOVERY_READINESS_CAP_MS;
  }

  /**
   * One probe. A failure marks Neo4j down; the first success after that starts the recovery
   * warm-up (shared with a round already in progress). Overlapping probes are skipped.
   */
  async probeNeo4j(): Promise<void> {
    if (this.probing || !this.neo4jProvider.isConnected()) return;
    this.probing = true;
    try {
      await this.neo4jProvider.getDriver().verifyConnectivity();
      if (this.neo4jDown) {
        this.neo4jDown = false;
        void this.recover();
      }
    } catch (error: unknown) {
      if (!this.neo4jDown) {
        this.logger.warn('Neo4j unreachable, warm-up will run when it is back', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
      this.neo4jDown = true;
    } finally {
      this.probing = false;
    }
  }

  private async recover(): Promise<void> {
    if (this.recoveringSince !== null) return;
    this.recoveringSince = Date.now();
    try {
      const report = await this.warm();
      this.logger.info('Neo4j back, warm-up done', { ...report });
    } finally {
      this.recoveringSince = null;
    }
  }

  /** One round. Never throws; a round already in progress is shared, not doubled. */
  warm(): Promise<Neo4jWarmupReport> {
    this.running ??= this.runRound().finally(() => {
      this.running = null;
    });
    return this.running;
  }

  private async runRound(): Promise<Neo4jWarmupReport> {
    const startedAt = Date.now();
    if (!this.neo4jProvider.isConnected()) {
      this.logger.warn('Neo4j is not connected, warm-up skipped');
      return { queries: 0, failures: 0, durationMs: 0 };
    }

    const connectionPings = Array.from(
      { length: NEO4J_WARMUP_CONNECTIONS },
      (): Neo4jWarmupQuery => () => this.ping(),
    );
    const hotFailures = await this.runInBatches(this.queries, NEO4J_WARMUP_CONCURRENCY);
    const pingFailures = await this.runInBatches(connectionPings, NEO4J_WARMUP_CONNECTIONS);
    const failures = hotFailures + pingFailures;
    if (failures > 0) {
      this.logger.warn('Neo4j warm-up had failures', { failures });
    }

    return {
      queries: this.queries.length + connectionPings.length,
      failures,
      durationMs: Date.now() - startedAt,
    };
  }

  private async ping(): Promise<void> {
    const session = this.neo4jProvider.getDriver().session();
    try {
      await session.run('RETURN 1');
    } finally {
      await session.close();
    }
  }

  private async runInBatches(queries: Neo4jWarmupQuery[], size: number): Promise<number> {
    let failures = 0;
    for (let index = 0; index < queries.length; index += size) {
      const results = await Promise.allSettled(queries.slice(index, index + size).map((q) => q()));
      failures += results.filter((result) => result.status === 'rejected').length;
    }
    return failures;
  }

  private async withBudget<T>(promise: Promise<T>, budgetMs: number): Promise<T | null> {
    let budget: NodeJS.Timeout | undefined;
    const timeout = new Promise<null>((resolve) => {
      budget = setTimeout(() => {
        resolve(null);
      }, budgetMs);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(budget);
    }
  }
}
