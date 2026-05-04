import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { PublicationCommandController } from '../../../modules/publication/controllers/publication.command.controller.js';
import { PublicationService } from '@volontariapp/domain-social';
import type {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../../../modules/publication/dto/publication.command.dto.js';
import {
  CreatePostNodeResponseDTO,
  DeletePostNodeResponseDTO,
  PostUserOwnResponseDTO,
  DeleteUserOwnResponseDTO,
} from '../../../modules/publication/dto/publication.response.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('PublicationCommandController', () => {
  let controller: PublicationCommandController;
  let service: jest.Mocked<PublicationService>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationCommandController],
      providers: [
        {
          provide: PublicationService,
          useValue: createMock<PublicationService>(),
        },
      ],
    }).compile();

    controller = module.get<PublicationCommandController>(PublicationCommandController);
    service = module.get(PublicationService);
  });

  describe('createPostNode', () => {
    it('should create a post node successfully', async () => {
      const dto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const spy = jest.spyOn(service, 'createPost');
      const result = await controller.createPostNode(dto);

      expect(result).toBeInstanceOf(CreatePostNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'post-123' }));
    });

    it('should throw error if service fails', async () => {
      const dto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const spy = jest
        .spyOn(service, 'createPost')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.createPostNode(dto)).rejects.toThrow('Database error');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deletePostNode', () => {
    it('should delete a post node successfully', async () => {
      const dto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      const spy = jest.spyOn(service, 'deletePost');
      const result = await controller.deletePostNode(dto);

      expect(result).toBeInstanceOf(DeletePostNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'post-123' }));
    });

    it('should throw error if service fails', async () => {
      const dto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      const spy = jest
        .spyOn(service, 'deletePost')
        .mockRejectedValueOnce(new Error('Post not found'));

      await expect(controller.deletePostNode(dto)).rejects.toThrow('Post not found');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('postUserOwn', () => {
    it('should set user ownership of post successfully', async () => {
      const dto: PostUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const spy = jest.spyOn(service, 'ownPost');
      const result = await controller.postUserOwn(dto, mockUser);

      expect(result).toBeInstanceOf(PostUserOwnResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'post-456' }),
      );
    });

    it('should call service with correct parameters', async () => {
      const dto: PostUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const spy = jest.spyOn(service, 'ownPost');
      await controller.postUserOwn(dto, mockUser);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw error if user not found', async () => {
      const dto: PostUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const spy = jest.spyOn(service, 'ownPost').mockRejectedValueOnce(new Error('User not found'));

      await expect(controller.postUserOwn(dto, mockUser)).rejects.toThrow('User not found');
      expect(spy).toHaveBeenCalled();
    });

    it('should throw error if post not found', async () => {
      const dto: PostUserOwnCommandDTO = {
        postId: 'non-existent-post',
      };
      const spy = jest.spyOn(service, 'ownPost').mockRejectedValueOnce(new Error('Post not found'));

      await expect(controller.postUserOwn(dto, mockUser)).rejects.toThrow('Post not found');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('deleteUserOwn', () => {
    it('should remove user ownership of post successfully', async () => {
      const dto: DeleteUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const spy = jest.spyOn(service, 'disownPost');
      const result = await controller.deleteUserOwn(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteUserOwnResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'post-456' }),
      );
    });

    it('should throw error if disown fails', async () => {
      const dto: DeleteUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const spy = jest
        .spyOn(service, 'disownPost')
        .mockRejectedValueOnce(new Error('Cannot disown post'));

      await expect(controller.deleteUserOwn(dto, mockUser)).rejects.toThrow('Cannot disown post');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Response validation', () => {
    it('should return valid response DTOs', async () => {
      const createDto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const createResult = await controller.createPostNode(createDto);
      expect(createResult).toBeInstanceOf(CreatePostNodeResponseDTO);

      const deleteDto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      const deleteResult = await controller.deletePostNode(deleteDto);
      expect(deleteResult).toBeInstanceOf(DeletePostNodeResponseDTO);

      const ownDto: PostUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const ownResult = await controller.postUserOwn(ownDto, mockUser);
      expect(ownResult).toBeInstanceOf(PostUserOwnResponseDTO);

      const disownDto: DeleteUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const disownResult = await controller.deleteUserOwn(disownDto, mockUser);
      expect(disownResult).toBeInstanceOf(DeleteUserOwnResponseDTO);
    });
  });

  describe('Multiple operations', () => {
    it('should handle multiple post creations', async () => {
      const dto1: CreateSocialPostCommandDTO = { postId: 'post-1' };
      const dto2: CreateSocialPostCommandDTO = { postId: 'post-2' };
      const spy = jest.spyOn(service, 'createPost');

      await controller.createPostNode(dto1);
      await controller.createPostNode(dto2);

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should handle create and delete operations', async () => {
      const createDto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const createSpy = jest.spyOn(service, 'createPost');
      await controller.createPostNode(createDto);

      const deleteDto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      const deleteSpy = jest.spyOn(service, 'deletePost');
      await controller.deletePostNode(deleteDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
