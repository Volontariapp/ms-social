import { Test, TestingModule } from '@nestjs/testing';
import { PublicationCommandController } from '../../../modules/social/controllers/publication.command.controller';
import { PublicationService } from '@volontariapp/domain-social';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../../../modules/social/dto/request/command/publication.command.dto';
import {
  CreatePostNodeResponseDTO,
  DeletePostNodeResponseDTO,
  PostUserOwnResponseDTO,
  DeleteUserOwnResponseDTO,
} from '../../../modules/social/dto/response/social.response.dto';

describe('PublicationCommandController', () => {
  let controller: PublicationCommandController;
  let service: PublicationService;

  beforeEach(async () => {
    const mockPublicationService = {
      createPost: jest.fn().mockResolvedValue(undefined),
      deletePost: jest.fn().mockResolvedValue(undefined),
      ownPost: jest.fn().mockResolvedValue(undefined),
      disownPost: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicationCommandController],
      providers: [
        {
          provide: PublicationService,
          useValue: mockPublicationService,
        },
      ],
    }).compile();

    controller = module.get<PublicationCommandController>(PublicationCommandController);
    service = module.get<PublicationService>(PublicationService);
  });

  describe('createPostNode', () => {
    it('should create a post node successfully', async () => {
      const dto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const result = await controller.createPostNode(dto);

      expect(result).toBeInstanceOf(CreatePostNodeResponseDTO);
      expect(service.createPost).toHaveBeenCalled();
    });

    it('should throw error if service fails', async () => {
      const dto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      (service.createPost as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      );

      await expect(controller.createPostNode(dto)).rejects.toThrow('Database error');
    });
  });

  describe('deletePostNode', () => {
    it('should delete a post node successfully', async () => {
      const dto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      const result = await controller.deletePostNode(dto);

      expect(result).toBeInstanceOf(DeletePostNodeResponseDTO);
      expect(service.deletePost).toHaveBeenCalled();
    });

    it('should throw error if service fails', async () => {
      const dto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      (service.deletePost as jest.Mock).mockRejectedValueOnce(
        new Error('Post not found')
      );

      await expect(controller.deletePostNode(dto)).rejects.toThrow('Post not found');
    });
  });

  describe('postUserOwn', () => {
    it('should set user ownership of post successfully', async () => {
      const dto: PostUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = await controller.postUserOwn(dto);

      expect(result).toBeInstanceOf(PostUserOwnResponseDTO);
      expect(service.ownPost).toHaveBeenCalled();
    });

    it('should call service with correct parameters', async () => {
      const dto: PostUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      await controller.postUserOwn(dto);

      expect(service.ownPost).toHaveBeenCalledTimes(1);
    });

    it('should throw error if user not found', async () => {
      const dto: PostUserOwnCommandDTO = {
        userId: 'non-existent-user',
        postId: 'post-456',
      };
      (service.ownPost as jest.Mock).mockRejectedValueOnce(
        new Error('User not found')
      );

      await expect(controller.postUserOwn(dto)).rejects.toThrow('User not found');
    });

    it('should throw error if post not found', async () => {
      const dto: PostUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'non-existent-post',
      };
      (service.ownPost as jest.Mock).mockRejectedValueOnce(
        new Error('Post not found')
      );

      await expect(controller.postUserOwn(dto)).rejects.toThrow('Post not found');
    });
  });

  describe('deleteUserOwn', () => {
    it('should remove user ownership of post successfully', async () => {
      const dto: DeleteUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = await controller.deleteUserOwn(dto);

      expect(result).toBeInstanceOf(DeleteUserOwnResponseDTO);
      expect(service.disownPost).toHaveBeenCalled();
    });

    it('should throw error if disown fails', async () => {
      const dto: DeleteUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      (service.disownPost as jest.Mock).mockRejectedValueOnce(
        new Error('Cannot disown post')
      );

      await expect(controller.deleteUserOwn(dto)).rejects.toThrow('Cannot disown post');
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
        userId: 'user-123',
        postId: 'post-456',
      };
      const ownResult = await controller.postUserOwn(ownDto);
      expect(ownResult).toBeInstanceOf(PostUserOwnResponseDTO);

      const disownDto: DeleteUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const disownResult = await controller.deleteUserOwn(disownDto);
      expect(disownResult).toBeInstanceOf(DeleteUserOwnResponseDTO);
    });
  });

  describe('Multiple operations', () => {
    it('should handle multiple post creations', async () => {
      const dto1: CreateSocialPostCommandDTO = { postId: 'post-1' };
      const dto2: CreateSocialPostCommandDTO = { postId: 'post-2' };

      await controller.createPostNode(dto1);
      await controller.createPostNode(dto2);

      expect(service.createPost).toHaveBeenCalledTimes(2);
    });

    it('should handle create and delete operations', async () => {
      const createDto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      await controller.createPostNode(createDto);

      const deleteDto: DeleteSocialPostCommandDTO = { postId: 'post-123' };
      await controller.deletePostNode(deleteDto);

      expect(service.createPost).toHaveBeenCalledTimes(1);
      expect(service.deletePost).toHaveBeenCalledTimes(1);
    });
  });
});
