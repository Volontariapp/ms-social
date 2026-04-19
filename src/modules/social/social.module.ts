import { Module } from '@nestjs/common';
import {
  SocialUserService,
  RelationshipService,
  PublicationService,
  InteractionService,
  ParticipationService,
  EventPostLinkService,
  Neo4jSocialUserRepository,
  Neo4jRelationshipRepository,
  Neo4jPublicationRepository,
  Neo4jInteractionRepository,
  Neo4jParticipationRepository,
  Neo4jEventPostLinkRepository,
} from '@volontariapp/domain-social';
import { UserNodeCommandController } from './controllers/user-node.command.controller.js';
import { UserNodeQueryController } from './controllers/user-node.query.controller.js';
import { RelationshipCommandController } from './controllers/relationship.command.controller.js';
import { RelationshipQueryController } from './controllers/relationship.query.controller.js';
import { PublicationCommandController } from './controllers/publication.command.controller.js';
import { PublicationQueryController } from './controllers/publication.query.controller.js';
import { InteractionCommandController } from './controllers/interaction.command.controller.js';
import { InteractionQueryController } from './controllers/interaction.query.controller.js';
import { ParticipationCommandController } from './controllers/participation.command.controller.js';
import { ParticipationQueryController } from './controllers/participation.query.controller.js';
import { EventPostLinkCommandController } from './controllers/event-post-link.command.controller.js';
import { EventPostLinkQueryController } from './controllers/event-post-link.query.controller.js';

@Module({
  imports: [],
  controllers: [
    UserNodeCommandController,
    UserNodeQueryController,
    RelationshipCommandController,
    RelationshipQueryController,
    PublicationCommandController,
    PublicationQueryController,
    InteractionCommandController,
    InteractionQueryController,
    ParticipationCommandController,
    ParticipationQueryController,
    EventPostLinkCommandController,
    EventPostLinkQueryController,
  ],
  providers: [
    Neo4jSocialUserRepository,
    Neo4jRelationshipRepository,
    Neo4jPublicationRepository,
    Neo4jInteractionRepository,
    Neo4jParticipationRepository,
    Neo4jEventPostLinkRepository,
    SocialUserService,
    RelationshipService,
    PublicationService,
    InteractionService,
    ParticipationService,
    EventPostLinkService,
  ],
  exports: [
    SocialUserService,
    RelationshipService,
    PublicationService,
    InteractionService,
    ParticipationService,
    EventPostLinkService,
  ],
})
export class SocialModule {}
