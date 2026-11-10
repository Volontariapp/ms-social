import { Module } from '@nestjs/common';
import { RelationshipService, Neo4jRelationshipRepository } from '@volontariapp/domain-social';
import { RelationshipCommandController } from './controllers/relationship.command.controller.js';
import { RelationshipQueryController } from './controllers/relationship.query.controller.js';
import { SocialEdgeModule } from '../social-edge/social-edge.module.js';

@Module({
  imports: [SocialEdgeModule],
  controllers: [RelationshipCommandController, RelationshipQueryController],
  providers: [Neo4jRelationshipRepository, RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
