import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { Test } from '@nestjs/testing';
import {
  InteractionService,
  ParticipationService,
  PublicationService,
  RelationshipService,
  SocialUserService,
} from '@volontariapp/domain-social';
import { SocialEdgeAction, SocialEdgeKind } from '@volontariapp/messaging';
import { InteractionCommandController } from '../../../modules/interaction/controllers/interaction.command.controller.js';
import { RelationshipCommandController } from '../../../modules/relationship/controllers/relationship.command.controller.js';
import { ParticipationCommandController } from '../../../modules/participation/controllers/participation.command.controller.js';
import { PublicationCommandController } from '../../../modules/publication/controllers/publication.command.controller.js';
import { UserNodeCommandController } from '../../../modules/user-node/controllers/user-node.command.controller.js';
import { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import { SocialEdgeMirrorService } from '../../../modules/social-edge/social-edge-mirror.service.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';
import { createSocialEdgeMirrorMock } from './social-edge-mirror.mock.js';
import { EVENT_ID, OTHER_USER_ID, POST_ID, USER_ID } from './social-edge.factory.js';

const user = createMockAuthUser({ id: USER_ID });

describe('social_edge mirror wiring (sync mode)', () => {
  let mirror: jest.Mocked<SocialEdgeMirrorService>;
  let interaction: jest.Mocked<InteractionService>;
  let relationship: jest.Mocked<RelationshipService>;
  let participation: jest.Mocked<ParticipationService>;
  let publication: jest.Mocked<PublicationService>;
  let userNode: jest.Mocked<SocialUserService>;
  let interactionController: InteractionCommandController;
  let relationshipController: RelationshipCommandController;
  let participationController: ParticipationCommandController;
  let publicationController: PublicationCommandController;
  let userNodeController: UserNodeCommandController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [
        InteractionCommandController,
        RelationshipCommandController,
        ParticipationCommandController,
        PublicationCommandController,
        UserNodeCommandController,
      ],
      providers: [
        { provide: SocialEdgeMirrorService, useValue: createSocialEdgeMirrorMock() },
        { provide: InteractionService, useValue: createMock<InteractionService>() },
        { provide: RelationshipService, useValue: createMock<RelationshipService>() },
        { provide: ParticipationService, useValue: createMock<ParticipationService>() },
        { provide: PublicationService, useValue: createMock<PublicationService>() },
        { provide: SocialUserService, useValue: createMock<SocialUserService>() },
        { provide: EventOrganizerPolicy, useValue: createMock<EventOrganizerPolicy>() },
      ],
    }).compile();

    mirror = module.get(SocialEdgeMirrorService);
    interaction = module.get(InteractionService);
    relationship = module.get(RelationshipService);
    participation = module.get(ParticipationService);
    publication = module.get(PublicationService);
    userNode = module.get(SocialUserService);
    interactionController = module.get(InteractionCommandController);
    relationshipController = module.get(RelationshipCommandController);
    participationController = module.get(ParticipationCommandController);
    publicationController = module.get(PublicationCommandController);
    userNodeController = module.get(UserNodeCommandController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('mirrorEdge is called after the Neo4j write', () => {
    it('like', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      await interactionController.postLikePost({ postId: POST_ID }, user);
      expect(spy).toHaveBeenCalledWith(SocialEdgeKind.LIKE, USER_ID, POST_ID, SocialEdgeAction.ADD);
    });

    it('unlike', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      await interactionController.deleteLikePost({ postId: POST_ID }, user);
      expect(spy).toHaveBeenCalledWith(
        SocialEdgeKind.LIKE,
        USER_ID,
        POST_ID,
        SocialEdgeAction.REMOVE,
      );
    });

    it('admin like', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      await interactionController.adminPostLikePost({ userId: OTHER_USER_ID, postId: POST_ID });
      expect(spy).toHaveBeenCalledWith(
        SocialEdgeKind.LIKE,
        OTHER_USER_ID,
        POST_ID,
        SocialEdgeAction.ADD,
      );
    });

    it('follow and unfollow', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      await relationshipController.postFollowUser({ followedId: OTHER_USER_ID }, user);
      await relationshipController.deleteFollowUser({ followedId: OTHER_USER_ID }, user);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        SocialEdgeKind.FOLLOW,
        USER_ID,
        OTHER_USER_ID,
        SocialEdgeAction.ADD,
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        SocialEdgeKind.FOLLOW,
        USER_ID,
        OTHER_USER_ID,
        SocialEdgeAction.REMOVE,
      );
    });

    it('wish and unwish', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      await participationController.postUserWishEvent({ eventId: EVENT_ID }, user);
      await participationController.deleteUserWishEvent({ eventId: EVENT_ID }, user);
      expect(spy).toHaveBeenNthCalledWith(
        1,
        SocialEdgeKind.WISH,
        USER_ID,
        EVENT_ID,
        SocialEdgeAction.ADD,
      );
      expect(spy).toHaveBeenNthCalledWith(
        2,
        SocialEdgeKind.WISH,
        USER_ID,
        EVENT_ID,
        SocialEdgeAction.REMOVE,
      );
    });

    it('participate and leave', async () => {
      const spy = jest.spyOn(mirror, 'mirrorParticipation').mockResolvedValue(undefined);
      await participationController.postUserParticipateEvent({ eventId: EVENT_ID }, user);
      await participationController.deleteUserParticipateEvent({ eventId: EVENT_ID }, user);
      expect(spy).toHaveBeenNthCalledWith(1, USER_ID, EVENT_ID, SocialEdgeAction.ADD);
      expect(spy).toHaveBeenNthCalledWith(2, USER_ID, EVENT_ID, SocialEdgeAction.REMOVE);
    });

    it('does not mirror the attendance check-in (state only)', async () => {
      const spy = jest.spyOn(mirror, 'mirror').mockResolvedValue(undefined);
      const participationSpy = jest.spyOn(mirror, 'mirrorParticipation');
      await participationController.setEventAttendance(
        { eventId: EVENT_ID, checkedUserIds: [OTHER_USER_ID], uncheckedUserIds: [] },
        user,
      );
      expect(spy).not.toHaveBeenCalled();
      expect(participationSpy).not.toHaveBeenCalled();
    });
  });

  describe('the mirror is not called when Neo4j fails', () => {
    it('like', async () => {
      jest.spyOn(interaction, 'likePost').mockRejectedValueOnce(new Error('neo4j down'));
      const spy = jest.spyOn(mirror, 'mirror');
      await expect(interactionController.postLikePost({ postId: POST_ID }, user)).rejects.toThrow(
        'neo4j down',
      );
      expect(spy).not.toHaveBeenCalled();
    });

    it('follow', async () => {
      jest.spyOn(relationship, 'followUser').mockRejectedValueOnce(new Error('already'));
      const spy = jest.spyOn(mirror, 'mirror');
      await expect(
        relationshipController.postFollowUser({ followedId: OTHER_USER_ID }, user),
      ).rejects.toThrow('already');
      expect(spy).not.toHaveBeenCalled();
    });

    it('participate', async () => {
      jest.spyOn(participation, 'participateEvent').mockRejectedValueOnce(new Error('no event'));
      const spy = jest.spyOn(mirror, 'mirrorParticipation');
      await expect(
        participationController.postUserParticipateEvent({ eventId: EVENT_ID }, user),
      ).rejects.toThrow('no event');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('deleteEdgesOfNode is called when a node is deleted', () => {
    it('user node', async () => {
      const spy = jest.spyOn(mirror, 'deleteEdgesOfNode').mockResolvedValue(undefined);
      await userNodeController.deleteUserNode({ userId: USER_ID });
      expect(spy).toHaveBeenCalledWith(USER_ID);
    });

    it('post node', async () => {
      const spy = jest.spyOn(mirror, 'deleteEdgesOfNode').mockResolvedValue(undefined);
      await publicationController.deletePostNode({ postId: POST_ID });
      expect(spy).toHaveBeenCalledWith(POST_ID);
    });

    it('event node', async () => {
      const spy = jest.spyOn(mirror, 'deleteEdgesOfNode').mockResolvedValue(undefined);
      await participationController.deleteEventNode({ eventId: EVENT_ID });
      expect(spy).toHaveBeenCalledWith(EVENT_ID);
    });

    it('not when the Neo4j delete fails', async () => {
      jest.spyOn(userNode, 'deleteUser').mockRejectedValueOnce(new Error('not found'));
      jest.spyOn(publication, 'deletePost').mockRejectedValueOnce(new Error('not found'));
      jest.spyOn(participation, 'deleteEvent').mockRejectedValueOnce(new Error('not found'));
      const spy = jest.spyOn(mirror, 'deleteEdgesOfNode');
      await expect(userNodeController.deleteUserNode({ userId: USER_ID })).rejects.toThrow();
      await expect(publicationController.deletePostNode({ postId: POST_ID })).rejects.toThrow();
      await expect(
        participationController.deleteEventNode({ eventId: EVENT_ID }),
      ).rejects.toThrow();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
