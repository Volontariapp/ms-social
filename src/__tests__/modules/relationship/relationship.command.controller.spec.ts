import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { RelationshipCommandController } from '../../../modules/relationship/controllers/relationship.command.controller.js';
import { RelationshipService } from '@volontariapp/domain-social';
import type {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
} from '../../../modules/relationship/dto/relationship.command.dto.js';
import {
  PostFollowUserResponseDTO,
  DeleteFollowUserResponseDTO,
  PostBlockUserResponseDTO,
  DeleteBlockUserResponseDTO,
} from '../../../modules/relationship/dto/relationship.response.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('RelationshipCommandController', () => {
  let controller: RelationshipCommandController;
  let service: jest.Mocked<RelationshipService>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationshipCommandController],
      providers: [
        {
          provide: RelationshipService,
          useValue: createMock<RelationshipService>(),
        },
      ],
    }).compile();

    controller = module.get<RelationshipCommandController>(RelationshipCommandController);
    service = module.get(RelationshipService);
  });

  describe('postFollowUser', () => {
    it('should follow a user successfully', async () => {
      const dto: PostFollowUserCommandDTO = { followedId: 'target-123' };
      const spy = jest.spyOn(service, 'followUser');
      const result = await controller.postFollowUser(dto, mockUser);

      expect(result).toBeInstanceOf(PostFollowUserResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'target-123' }),
      );
    });

    it('should throw error if service fails', async () => {
      const dto: PostFollowUserCommandDTO = { followedId: 'target-123' };
      const spy = jest
        .spyOn(service, 'followUser')
        .mockRejectedValueOnce(new Error('Follow failed'));

      await expect(controller.postFollowUser(dto, mockUser)).rejects.toThrow('Follow failed');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deleteFollowUser', () => {
    it('should unfollow a user successfully', async () => {
      const dto: DeleteFollowUserCommandDTO = { followedId: 'target-123' };
      const spy = jest.spyOn(service, 'unfollowUser');
      const result = await controller.deleteFollowUser(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteFollowUserResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'target-123' }),
      );
    });
  });

  describe('postBlockUser', () => {
    it('should block a user successfully', async () => {
      const dto: PostBlockUserCommandDTO = { blockedId: 'target-123' };
      const spy = jest.spyOn(service, 'blockUser');
      const result = await controller.postBlockUser(dto, mockUser);

      expect(result).toBeInstanceOf(PostBlockUserResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'target-123' }),
      );
    });
  });

  describe('deleteBlockUser', () => {
    it('should unblock a user successfully', async () => {
      const dto: DeleteBlockUserCommandDTO = { blockedId: 'target-123' };
      const spy = jest.spyOn(service, 'unblockUser');
      const result = await controller.deleteBlockUser(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteBlockUserResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'target-123' }),
      );
    });
  });
});
