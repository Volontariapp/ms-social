import { describe, it, expect } from '@jest/globals';
import { UserId, PostId, PaginationVO, PostLikeSummaryVO } from '@volontariapp/domain-social';
import { InteractionMapper } from '../../../modules/interaction/mappers/interaction.mapper.js';
import type {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
} from '../../../modules/interaction/dto/interaction.command.dto.js';
import type {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
  GetPostsLikeSummaryQueryDTO,
} from '../../../modules/interaction/dto/interaction.query.dto.js';
import type { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';
import { createMockAuthUser } from '../../utils/mock.helper.js';

describe('InteractionMapper', () => {
  const mockUser = createMockAuthUser();

  describe('toLikePostParams', () => {
    it('should convert PostLikePostCommandDTO and user to params', () => {
      const dto: PostLikePostCommandDTO = {
        postId: 'post-456',
      };
      const result = InteractionMapper.toLikePostParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.postId.value).toBe('post-456');
    });

    it('should handle UUID format IDs', () => {
      const dto: PostLikePostCommandDTO = {
        postId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = InteractionMapper.toLikePostParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.postId.value).toBe('550e8400-e29b-41d4-a716-446655440001');
    });
  });

  describe('toUnlikePostParams', () => {
    it('should convert DeleteLikePostCommandDTO and user to params', () => {
      const dto: DeleteLikePostCommandDTO = {
        postId: 'post-456',
      };
      const result = InteractionMapper.toUnlikePostParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.postId.value).toBe('post-456');
    });
  });

  describe('toGetUserLikesParams', () => {
    it('should convert GetUserLikesQueryDTO and user without pagination', () => {
      const dto: GetUserLikesQueryDTO = {
        pagination: undefined,
      };
      const result = InteractionMapper.toGetUserLikesParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetUserLikesQueryDTO and user with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetUserLikesQueryDTO = {
        pagination,
      };
      const result = InteractionMapper.toGetUserLikesParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetPostLikersParams', () => {
    it('should convert GetPostLikersQueryDTO without pagination', () => {
      const dto: GetPostLikersQueryDTO = {
        postId: 'post-789',
        pagination: undefined,
      };
      const result = InteractionMapper.toGetPostLikersParams(dto);

      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetPostLikersQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 15 };
      const dto: GetPostLikersQueryDTO = {
        postId: 'post-789',
        pagination,
      };
      const result = InteractionMapper.toGetPostLikersParams(dto);

      expect(result.postId).toBeInstanceOf(PostId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetPostsLikeSummaryParams', () => {
    it('should convert GetPostsLikeSummaryQueryDTO and user to params', () => {
      const dto: GetPostsLikeSummaryQueryDTO = {
        postIds: ['post-1', 'post-2'],
      };
      const result = InteractionMapper.toGetPostsLikeSummaryParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.postIds).toHaveLength(2);
      expect(result.postIds[0]).toBeInstanceOf(PostId);
      expect(result.postIds[0].value).toBe('post-1');
      expect(result.postIds[1]).toBeInstanceOf(PostId);
      expect(result.postIds[1].value).toBe('post-2');
    });
  });

  describe('toPostLikeSummaryDTO', () => {
    it('should map PostLikeSummaryVO to DTO', () => {
      const vo = new PostLikeSummaryVO('post-1', 42, true);
      const result = InteractionMapper.toPostLikeSummaryDTO(vo);

      expect(result).toEqual({
        postId: 'post-1',
        likeCount: 42,
        likedByMe: true,
      });
    });
  });

  describe('toGetPostsLikeSummaryResponseDTO', () => {
    it('should map array of PostLikeSummaryVO to response DTO', () => {
      const summaries = [
        new PostLikeSummaryVO('post-1', 42, true),
        new PostLikeSummaryVO('post-2', 0, false),
      ];
      const result = InteractionMapper.toGetPostsLikeSummaryResponseDTO(summaries);

      expect(result.summaries).toHaveLength(2);
      expect(result.summaries[0]).toEqual({
        postId: 'post-1',
        likeCount: 42,
        likedByMe: true,
      });
      expect(result.summaries[1]).toEqual({
        postId: 'post-2',
        likeCount: 0,
        likedByMe: false,
      });
    });
  });
});
