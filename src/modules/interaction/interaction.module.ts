import { Module } from '@nestjs/common';
import { InteractionService, Neo4jInteractionRepository } from '@volontariapp/domain-social';
import { InteractionCommandController } from './controllers/interaction.command.controller.js';
import { InteractionQueryController } from './controllers/interaction.query.controller.js';

@Module({
  controllers: [InteractionCommandController, InteractionQueryController],
  providers: [Neo4jInteractionRepository, InteractionService],
  exports: [InteractionService],
})
export class InteractionModule {}
