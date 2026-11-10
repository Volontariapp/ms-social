import type { Config } from 'neo4j-driver';
import { Logger } from '@volontariapp/logger';

/** neo4j-driver does not re-export its LogLevel type: derive it from the logging config. */
type Neo4jLogLevel = Parameters<NonNullable<Config['logging']>['logger']>[0];

/**
 * Connections per ms-social pod. At 400 req/s the app mix sends about 480 Neo4j sessions per
 * second (events-list-app: exclusions and participant counts; posts-list: post-event links;
 * is-following: one), 240 per pod. Little's law: 20 ms per session gives 5 in flight per pod,
 * 100 ms gives 24. On 2026-11-09 a 0 s onset of is-following at 100 req/s (50 sessions per second
 * per pod) grew each pool to 8 connections; scaled to 240 per second that is close to 40 at the
 * onset. 32 keeps that onset mostly served while 2 pods x 32 still bound what Neo4j has to serve.
 */
export const NEO4J_MAX_CONNECTION_POOL_SIZE = 32;

/** Under the 2 s gateway read deadline: past it, the caller has already given up. */
export const NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS = 1_500;

export const NEO4J_CONNECTION_TIMEOUT_MS = 1_000;

/** A connection idle for longer than this is checked (one RESET round trip) before reuse. */
export const NEO4J_CONNECTION_LIVENESS_CHECK_TIMEOUT_MS = 30_000;

/** The driver default (1 h) closes every pooled connection after an idle evening. */
export const NEO4J_MAX_CONNECTION_LIFETIME_MS = 6 * 60 * 60 * 1000;

const driverLogger = new Logger({ context: 'Neo4jDriver', format: 'json' });

/** Forwards the driver's own logs (warn and error only) to @volontariapp/logger. */
export const logNeo4jDriverMessage = (level: Neo4jLogLevel, message: string): void => {
  if (level === 'error') {
    driverLogger.error(message);
    return;
  }
  if (level === 'warn') {
    driverLogger.warn(message);
    return;
  }
  driverLogger.debug(message);
};

export const buildNeo4jDriverConfig = (): Config => ({
  maxConnectionPoolSize: NEO4J_MAX_CONNECTION_POOL_SIZE,
  connectionAcquisitionTimeout: NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS,
  connectionTimeout: NEO4J_CONNECTION_TIMEOUT_MS,
  connectionLivenessCheckTimeout: NEO4J_CONNECTION_LIVENESS_CHECK_TIMEOUT_MS,
  maxConnectionLifetime: NEO4J_MAX_CONNECTION_LIFETIME_MS,
  logging: { level: 'warn', logger: logNeo4jDriverMessage },
});
