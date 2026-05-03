import { Module } from '@nestjs/common';
import { EventPostLinkService, Neo4jEventPostLinkRepository } from '@volontariapp/domain-social';
import { EventPostLinkCommandController } from './controllers/event-post-link.command.controller.js';
import { EventPostLinkQueryController } from './controllers/event-post-link.query.controller.js';

@Module({
  controllers: [EventPostLinkCommandController, EventPostLinkQueryController],
  providers: [Neo4jEventPostLinkRepository, EventPostLinkService],
  exports: [EventPostLinkService],
})
export class EventPostLinkModule {}
