import { Module } from '@nestjs/common';
import { ParticipationService, Neo4jParticipationRepository } from '@volontariapp/domain-social';
import { ParticipationCommandController } from './controllers/participation.command.controller.js';
import { ParticipationQueryController } from './controllers/participation.query.controller.js';

@Module({
  controllers: [ParticipationCommandController, ParticipationQueryController],
  providers: [Neo4jParticipationRepository, ParticipationService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
