import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UserNodeCommandController } from '../../../modules/user-node/controllers/user-node.command.controller.js';
import { SocialUserService } from '@volontariapp/domain-social';
import type {
  CreateSocialUserCommandDTO,
  DeleteSocialUserCommandDTO,
} from '../../../modules/user-node/dto/user-node.command.dto.js';
import {
  CreateUserNodeResponseDTO,
  DeleteUserNodeResponseDTO,
} from '../../../modules/user-node/dto/user-node.response.dto.js';
import { createMock } from '../../utils/mock.helper.js';

describe('UserNodeCommandController', () => {
  let controller: UserNodeCommandController;
  let service: jest.Mocked<SocialUserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserNodeCommandController],
      providers: [
        {
          provide: SocialUserService,
          useValue: createMock<SocialUserService>(),
        },
      ],
    }).compile();

    controller = module.get<UserNodeCommandController>(UserNodeCommandController);
    service = module.get(SocialUserService);
  });

  describe('createUserNode', () => {
    it('should create a user node successfully', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'user-123' };
      const spy = jest.spyOn(service, 'createUser');
      const result = await controller.createUserNode(dto);

      expect(result).toBeInstanceOf(CreateUserNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'user-123' }));
    });

    it('should call service with correct UserId', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'specific-user-id' };
      const spy = jest.spyOn(service, 'createUser');
      await controller.createUserNode(dto);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'specific-user-id' }));
    });

    it('should throw error if service fails', async () => {
      const dto: CreateSocialUserCommandDTO = { userId: 'user-123' };
      const spy = jest
        .spyOn(service, 'createUser')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(controller.createUserNode(dto)).rejects.toThrow('Database error');
      expect(spy).toHaveBeenCalled();
    });

    it('should handle multiple user creations', async () => {
      const dto1: CreateSocialUserCommandDTO = { userId: 'user-1' };
      const dto2: CreateSocialUserCommandDTO = { userId: 'user-2' };
      const spy = jest.spyOn(service, 'createUser');

      await controller.createUserNode(dto1);
      await controller.createUserNode(dto2);

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteUserNode', () => {
    it('should delete a user node successfully', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'user-123' };
      const spy = jest.spyOn(service, 'deleteUser');
      const result = await controller.deleteUserNode(dto);

      expect(result).toBeInstanceOf(DeleteUserNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'user-123' }));
    });

    it('should call service with correct UserId', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'specific-user-id' };
      const spy = jest.spyOn(service, 'deleteUser');
      await controller.deleteUserNode(dto);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'specific-user-id' }));
    });

    it('should throw error if service fails', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'user-123' };
      const spy = jest
        .spyOn(service, 'deleteUser')
        .mockRejectedValueOnce(new Error('User not found'));

      await expect(controller.deleteUserNode(dto)).rejects.toThrow('User not found');
      expect(spy).toHaveBeenCalled();
    });

    it('should handle deletion of non-existent users', async () => {
      const dto: DeleteSocialUserCommandDTO = { userId: 'non-existent-user' };
      const spy = jest
        .spyOn(service, 'deleteUser')
        .mockRejectedValueOnce(new Error('User not found'));

      await expect(controller.deleteUserNode(dto)).rejects.toThrow();
      expect(spy).toHaveBeenCalled();
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
