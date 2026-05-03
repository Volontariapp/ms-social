import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSocialUserCommandDTO } from '../../../modules/user-node/dto/user-node.command.dto';
import {
  CreateSocialPostCommandDTO,
  PostUserOwnCommandDTO,
} from '../../../modules/publication/dto/publication.command.dto';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto';

describe('DTO Validation - Bad Request Scenarios', () => {
  describe('Missing required fields return validation errors (400)', () => {
    it('should return validation error for missing userId in CreateSocialUserCommandDTO', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {});
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toBeDefined();
    });

    it('should return validation error for missing postId in CreateSocialPostCommandDTO', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {});
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('postId');
    });

    it('should return validation error for missing userId in PostUserOwnCommandDTO', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        postId: 'post-123',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'userId')).toBe(true);
    });

    it('should return validation error for missing postId in PostUserOwnCommandDTO', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'postId')).toBe(true);
    });

    it('should return validation errors for missing pagination fields', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {});
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Invalid type returns validation errors (400)', () => {
    it('should return validation error for non-string userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: 123,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should return validation error for non-string postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: true,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for non-string userId in PostUserOwnCommandDTO', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: { id: '123' },
        postId: 'post-456',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.property === 'userId')).toBe(true);
    });

    it('should return validation error for non-integer page', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: '1',
        limit: 10,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should return validation error for non-integer limit', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 1,
        limit: '10',
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });
  });

  describe('Out of range values return validation errors (400)', () => {
    it('should return validation error for page = 0', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 0,
        limit: 10,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('page');
    });

    it('should return validation error for limit = 0', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 1,
        limit: 0,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('limit');
    });

    it('should return validation error for negative page', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: -5,
        limit: 10,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for negative limit', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 1,
        limit: -10,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Null/undefined values return validation errors (400)', () => {
    it('should return validation error for null userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: null,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for null postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: null,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for null page', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: null,
        limit: 10,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for null limit', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 1,
        limit: null,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Complex invalid objects return validation errors (400)', () => {
    it('should return validation error for array as userId', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: ['user1', 'user2'],
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation error for object as postId', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: { id: 'post-123' },
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return validation errors for multiple invalid fields', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 123,
        postId: false,
      });
      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Valid payloads pass validation', () => {
    it('should pass validation for valid CreateSocialUserCommandDTO', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: 'valid-user-id',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation for valid CreateSocialPostCommandDTO', async () => {
      const dto = plainToInstance(CreateSocialPostCommandDTO, {
        postId: 'valid-post-id',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation for valid PostUserOwnCommandDTO', async () => {
      const dto = plainToInstance(PostUserOwnCommandDTO, {
        userId: 'user-123',
        postId: 'post-456',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation for valid PaginationRequestDTO', async () => {
      const dto = plainToInstance(PaginationRequestDTO, {
        page: 1,
        limit: 10,
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });

    it('should pass validation with UUID formats', async () => {
      const dto = plainToInstance(CreateSocialUserCommandDTO, {
        userId: '550e8400-e29b-41d4-a716-446655440000',
      });
      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    });
  });
});
