import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { InteractionCommandController } from '../../../modules/interaction/controllers/interaction.command.controller.js';
import { InteractionService } from '@volontariapp/domain-social';
import type {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
} from '../../../modules/interaction/dto/interaction.command.dto.js';
import {
  PostLikePostResponseDTO,
  DeleteLikePostResponseDTO,
} from '../../../modules/interaction/dto/interaction.response.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('InteractionCommandController', () => {
  let controller: InteractionCommandController;
  let service: jest.Mocked<InteractionService>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionCommandController],
      providers: [
        {
          provide: InteractionService,
          useValue: createMock<InteractionService>(),
        },
      ],
    }).compile();

    controller = module.get<InteractionCommandController>(InteractionCommandController);
    service = module.get(InteractionService);
  });

  describe('postLikePost', () => {
    it('should like a post successfully', async () => {
      const dto: PostLikePostCommandDTO = { postId: 'post-123' };
      const spy = jest.spyOn(service, 'likePost');
      const result = await controller.postLikePost(dto, mockUser);

      expect(result).toBeInstanceOf(PostLikePostResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'post-123' }),
      );
    });

    it('should throw error if service fails', async () => {
      const dto: PostLikePostCommandDTO = { postId: 'post-123' };
      const spy = jest.spyOn(service, 'likePost').mockRejectedValueOnce(new Error('Like failed'));

      await expect(controller.postLikePost(dto, mockUser)).rejects.toThrow('Like failed');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deleteLikePost', () => {
    it('should unlike a post successfully', async () => {
      const dto: DeleteLikePostCommandDTO = { postId: 'post-123' };
      const spy = jest.spyOn(service, 'unlikePost');
      const result = await controller.deleteLikePost(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteLikePostResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'post-123' }),
      );
    });
  });
});
