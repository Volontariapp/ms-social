import { Inject, Injectable, Optional } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { SocialEdgeAction, SocialEdgeKind } from '@volontariapp/messaging';
import { SocialEdgeIntentService, type SocialWriteMode } from '@volontariapp/domain-social';
import { SOCIAL_WRITE_MODE } from './social-edge.constants.js';

/**
 * Phase 1 of L9 ("double write", `sync` mode): once the existing Neo4j write has succeeded, the
 * same relation is mirrored into the Postgres table `social_edge`. A failure is logged and never
 * propagated: the Neo4j write already happened and the answer of the RPC must not change; the
 * backfill script reconciles the table afterwards.
 */
@Injectable()
export class SocialEdgeMirrorService {
  private readonly logger = new Logger({ context: SocialEdgeMirrorService.name });

  constructor(
    private readonly intents: SocialEdgeIntentService,
    @Optional() @Inject(SOCIAL_WRITE_MODE) private readonly mode: SocialWriteMode = 'sync',
  ) {
    if (this.mode === 'async') {
      this.logger.warn(
        'socialWriteMode=async is not wired in ms-social yet: keeping the sync double write',
      );
    }
  }

  async mirror(
    kind: SocialEdgeKind,
    fromId: string,
    toId: string,
    action: SocialEdgeAction,
  ): Promise<void> {
    try {
      await this.intents.mirrorEdge(kind, fromId, toId, action);
    } catch (error) {
      this.logger.error(
        `social_edge mirror failed (${kind} ${action} ${fromId} -> ${toId}), the backfill will reconcile`,
        error,
      );
    }
  }

  /** Participating removes the wish of the same pair, like the Neo4j write does. */
  async mirrorParticipation(
    userId: string,
    eventId: string,
    action: SocialEdgeAction,
  ): Promise<void> {
    await this.mirror(SocialEdgeKind.PARTICIPATE, userId, eventId, action);
    if (action === SocialEdgeAction.ADD) {
      await this.mirror(SocialEdgeKind.WISH, userId, eventId, SocialEdgeAction.REMOVE);
    }
  }

  async deleteEdgesOfNode(nodeId: string): Promise<void> {
    try {
      await this.intents.deleteEdgesOfNode(nodeId);
    } catch (error) {
      this.logger.error(`social_edge cleanup failed for node ${nodeId}`, error);
    }
  }
}
