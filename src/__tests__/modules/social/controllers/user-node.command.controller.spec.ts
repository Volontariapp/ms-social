import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UserNodeCommandController } from '../../../../modules/social/controllers/user-node.command.controller';
import { SocialUserService } from '@volontariapp/domain-social';
import {
  CreateSocialUserCommandDTO,
  DeleteSocialUserCommandDTO,
} from '../../../../modules/social/dto/request/command/user-node.command.dto';
import {
  CreateUserNodeResponseDTO,
  DeleteUserNodeResponseDTO,
} from '../../../../modules/social/dto/response/social.response.dto';

describe('UserNodeCommandController', () => {
  let controller: UserNodeCommandController;
  let service: SocialUserService;

  beforeEach(async () => {
    const mockSocialUserService = {
      createUser: jest.fn().mockResolvedValue(undefined),
      deleteUser: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNodeCommandController],
      providers: [
        {
          provide: SocialUserService,
          useValue: mockSocialUserService,
        },
      ],
    }).compile();

    controller = module.get<UserNodeCommandController>(
      UserNodeCommandController,
    );
    service = module.get<SocialUserService>(SocialUserService);
  });

  describe('createUserNode', () => {
    it('should create a user node successfully', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'user-123' };
      const result = await controller.createUserNode(dto);

      expect(result).toBeInstanceOf(CreateUserNodeResponseDTO);
      expect(service.createUser).toHaveBeenCalled();
    });

    it('should call service with correct UserId', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'specific-user-id' };
      await controller.createUserNode(dto);

      expect(service.createUser).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service fails', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'user-123' };
      (service.createUser as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );

      await expect(controller.createUserNode(dto)).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle multiple user creations', async () => {
      const dto1: CreateSocialUserCommandDTO = { userId: 'user-1' };
      const dto2: CreateSocialUserCommandDTO = { userId: 'user-2' };

      await controller.createUserNode(dto1);
      await controller.createUserNode(dto2);

      expect(service.createUser).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteUserNode', () => {
    it('should delete a user node successfully', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'user-123' };
      const result = await controller.deleteUserNode(dto);

      expect(result).toBeInstanceOf(DeleteUserNodeResponseDTO);
      expect(service.deleteUser).toHaveBeenCalled();
    });

    it('should call service with correct UserId', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'specific-user-id' };
      await controller.deleteUserNode(dto);

      expect(service.deleteUser).toHaveBeenCalledTimes(1);
    });

    it('should throw error if service fails', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'user-123' };
      (service.deleteUser as jest.Mock).mockRejectedValueOnce(
        new Error('User not found'),
      );

      await expect(controller.deleteUserNode(dto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle deletion of non-existent users', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'non-existent-user' };
      (service.deleteUser as jest.Mock).mockRejectedValueOnce(
        new Error('User not found'),
      );

      await expect(controller.deleteUserNode(dto)).rejects.toThrow();
    });
  });

  describe('Response validation', () => {
    it('should return valid CreateUserNodeResponseDTO', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'user-123' };
      const result = await controller.createUserNode(dto);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(CreateUserNodeResponseDTO);
    });

    it('should return valid DeleteUserNodeResponseDTO', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'user-123' };
      const result = await controller.deleteUserNode(dto);

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(DeleteUserNodeResponseDTO);
    });
  });
});
