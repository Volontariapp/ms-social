import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { describe, it, expect } from '@jest/globals';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
  AdminPostUserOwnCommandDTO,
  AdminDeleteUserOwnCommandDTO,
} from '../../../modules/publication/dto/publication.command.dto.js';

describe('Publication Command DTOs', () => {
  describe('CreateSocialPostCommandDTO', () => {
    it('should validate with valid postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: 'post-123',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('postId');
    });
  });

  describe('DeleteSocialPostCommandDTO', () => {
    it('should validate with valid postId', async () => {
      const dto = plainToInstance(DeleteSocialPostCommandDTO, {
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(DeleteSocialPostCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('PostUserOwnCommandDTO', () => {
    it('should validate with valid postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('DeleteUserOwnCommandDTO', () => {
    it('should validate with valid postId', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {
        postId: 'post-101',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('AdminPostUserOwnCommandDTO', () => {
    it('should validate with valid userId and postId', async () => {
      const dto = plainToInstance(AdminPostUserOwnCommandDTO, {
        userId: 'user-123',
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing userId', async () => {
      const dto = plainToInstance(AdminPostUserOwnCommandDTO, {
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });
  });

  describe('AdminDeleteUserOwnCommandDTO', () => {
    it('should validate with valid userId and postId', async () => {
      const dto = plainToInstance(AdminDeleteUserOwnCommandDTO, {
        userId: 'user-123',
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(AdminDeleteUserOwnCommandDTO, {
        userId: 'user-123',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('postId');
    });
  });
});
