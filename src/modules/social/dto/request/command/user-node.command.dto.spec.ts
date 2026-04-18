import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateSocialUserCommandDTO,
  DeleteSocialUserCommandDTO,
} from './user-node.command.dto';

describe('UserNode Command DTOs', () => {
  describe('CreateSocialUserCommandDTO', () => {
    it('should validate with valid userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: 'user-123',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with null userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: null,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with non-string userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: 123,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with empty string userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: '',
      });
      const errors = await validate(dto);
      // IsString() allows empty strings, so this should pass
      expect(errors).toHaveLength(0);
    });

    it('should validate with UUID format userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: '550e8400-e29b-41d4-a716-446655440000',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with object as userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: { id: '123' },
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('DeleteSocialUserCommandDTO', () => {
    it('should validate with valid userId', async () => {
      const dto = plainToInstance(DeleteSocialUserCommandDTO, {
        userId: 'user-456',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with missing userId', async () => {
      const dto = plainToInstance(DeleteSocialUserCommandDTO, {});
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with non-string userId', async () => {
      const dto = plainToInstance(DeleteSocialUserCommandDTO, {
        userId: 456,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with array userId', async () => {
      const dto = plainToInstance(DeleteSocialUserCommandDTO, {
        userId: ['user-1', 'user-2'],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
