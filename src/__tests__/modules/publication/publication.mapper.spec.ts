import { PostId, UserId, PaginationVO } from '@volontariapp/domain-social';
import { PublicationMapper } from '../../../modules/publication/mappers/publication.mapper.js';
import type {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../../../modules/publication/dto/publication.command.dto.js';
import type {
  GetSocialPostQueryDTO,
  GetUserPostsQueryDTO,
  GetFeedQueryDTO,
} from '../../../modules/publication/dto/publication.query.dto.js';
import type { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';
import { createMockAuthUser } from '../../utils/mock.helper.js';
import { describe, it, expect } from '@jest/globals';

describe('PublicationMapper', () => {
  const mockUser = createMockAuthUser();

  describe('toPostIdVO', () => {
    it('should create a PostId VO from string', () => {
      const postId = 'post-123';
      const result = PublicationMapper.toPostIdVO(postId);
      expect(result).toBeInstanceOf(PostId);
    });

    it('should handle UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = PublicationMapper.toPostIdVO(uuid);
      expect(result).toBeInstanceOf(PostId);
    });
  });

  describe('toPostIdVOFromCommand', () => {
    it('should convert CreateSocialPostCommandDTO to PostId VO', () => {
      const dto: CreateSocialPostCommandDTO = { postId: 'post-123' };
      const result = PublicationMapper.toPostIdVOFromCommand(dto);
      expect(result).toBeInstanceOf(PostId);
    });
  });

  describe('toDeletePostIdVOFromCommand', () => {
    it('should convert DeleteSocialPostCommandDTO to PostId VO', () => {
      const dto: DeleteSocialPostCommandDTO = { postId: 'post-456' };
      const result = PublicationMapper.toDeletePostIdVOFromCommand(dto);
      expect(result).toBeInstanceOf(PostId);
    });
  });

  describe('toOwnPostCommandParams', () => {
    it('should convert PostUserOwnCommandDTO and user to params with UserId and PostId', () => {
      const dto: PostUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const result = PublicationMapper.toOwnPostCommandParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.postId.value).toBe('post-456');
    });
  });

  describe('toDisownPostCommandParams', () => {
    it('should convert DeleteUserOwnCommandDTO and user to params', () => {
      const dto: DeleteUserOwnCommandDTO = {
        postId: 'post-456',
      };
      const result = PublicationMapper.toDisownPostCommandParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.postId.value).toBe('post-456');
    });
  });

  describe('toGetPostQueryParams', () => {
    it('should convert GetSocialPostQueryDTO to PostId', () => {
      const dto: GetSocialPostQueryDTO = { postId: 'post-789' };
      const result = PublicationMapper.toGetPostQueryParams(dto);
      expect(result).toBeInstanceOf(PostId);
    });
  });

  describe('toGetUserPostsQueryParams', () => {
    it('should convert GetUserPostsQueryDTO without pagination', () => {
      const dto: GetUserPostsQueryDTO = {
        pagination: undefined,
      };
      const result = PublicationMapper.toGetUserPostsQueryParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetUserPostsQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetUserPostsQueryDTO = {
        pagination,
      };
      const result = PublicationMapper.toGetUserPostsQueryParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetFeedQueryParams', () => {
    it('should convert GetFeedQueryDTO without pagination', () => {
      const dto: GetFeedQueryDTO = {
        pagination: undefined,
      };
      const result = PublicationMapper.toGetFeedQueryParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetFeedQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 2, limit: 20 };
      const dto: GetFeedQueryDTO = {
        pagination,
      };
      const result = PublicationMapper.toGetFeedQueryParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });
});
