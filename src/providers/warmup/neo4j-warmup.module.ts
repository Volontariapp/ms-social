import { Module } from '@nestjs/common';
import { EventPostLinkModule } from '../../modules/event-post-link/event-post-link.module.js';
import { ParticipationModule } from '../../modules/participation/participation.module.js';
import { RelationshipModule } from '../../modules/relationship/relationship.module.js';
import { Neo4jWarmer } from './neo4j-warmer.js';

@Module({
  imports: [ParticipationModule, RelationshipModule, EventPostLinkModule],
  providers: [Neo4jWarmer],
})
export class Neo4jWarmupModule {}
