import { Module } from '@nestjs/common';
import { PublicationService, Neo4jPublicationRepository } from '@volontariapp/domain-social';
import { PublicationCommandController } from './controllers/publication.command.controller.js';
import { PublicationQueryController } from './controllers/publication.query.controller.js';

@Module({
  controllers: [PublicationCommandController, PublicationQueryController],
  providers: [Neo4jPublicationRepository, PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {}
