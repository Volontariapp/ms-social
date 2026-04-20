import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../../../../modules/social/dto/request/command/publication.command.dto';

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

    it('should fail validation with non-string postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: 123,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with null postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: null,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
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

    it('should fail validation with non-string postId', async () => {
      const dto = plainToInstance(DeleteSocialPostCommandDTO, {
        postId: true,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('PostUserOwnCommandDTO', () => {
    it('should validate with valid userId and postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing userId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('postId');
    });

    it('should fail validation with non-string userId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 123,
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with non-string postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
        postId: 456,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with null userId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: null,
        postId: 'post-456',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with null postId', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
        postId: null,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('DeleteUserOwnCommandDTO', () => {
    it('should validate with valid userId and postId', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {
        userId: 'user-789',
        postId: 'post-101',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing userId', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {
        postId: 'post-101',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with missing postId', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {
        userId: 'user-789',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with object values', async () => {
      const dto = plainToInstance(DeleteUserOwnCommandDTO, {
        userId: { id: 'user-789' },
        postId: 'post-101',
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
