import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common';
import { EventPostLinkModule } from '../../modules/event-post-link/event-post-link.module.js';
import { ParticipationModule } from '../../modules/participation/participation.module.js';
import { RelationshipModule } from '../../modules/relationship/relationship.module.js';
import { Neo4jWarmer } from './neo4j-warmer.js';
import { WarmupReadinessMiddleware } from './warmup-readiness.middleware.js';

@Module({
  imports: [ParticipationModule, RelationshipModule, EventPostLinkModule],
  providers: [Neo4jWarmer, WarmupReadinessMiddleware],
})
export class Neo4jWarmupModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(WarmupReadinessMiddleware)
      .forRoutes({ path: 'health', method: RequestMethod.GET });
  }
}
