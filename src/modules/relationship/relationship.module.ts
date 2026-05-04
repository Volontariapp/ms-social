import { Module } from '@nestjs/common';
import { RelationshipService, Neo4jRelationshipRepository } from '@volontariapp/domain-social';
import { RelationshipCommandController } from './controllers/relationship.command.controller.js';
import { RelationshipQueryController } from './controllers/relationship.query.controller.js';

@Module({
  controllers: [RelationshipCommandController, RelationshipQueryController],
  providers: [Neo4jRelationshipRepository, RelationshipService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
