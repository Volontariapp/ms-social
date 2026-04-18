import { UserId, PostId, PaginationVO } from '@volontariapp/domain-social';
import { InteractionMapper } from './interaction.mapper';
import {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
} from '../dto/request/command/interaction.command.dto';
import {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
} from '../dto/request/query/interaction.query.dto';
import { PaginationRequestDTO } from '../dto/common/pagination.dto';

describe('InteractionMapper', () => {
  describe('toLikePostParams', () => {
    it('should convert PostLikePostCommandDTO to params', () => {
      const dto: PostLikePostCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = InteractionMapper.toLikePostParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });

    it('should preserve userId and postId values', () => {
      const userId = 'specific-user';
      const postId = 'specific-post';
      const dto: PostLikePostCommandDTO = { userId, postId };
      const result = InteractionMapper.toLikePostParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });

    it('should handle UUID format IDs', () => {
      const dto: PostLikePostCommandDTO = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        postId: '550e8400-e29b-41d4-a716-446655440001',
      };
      const result = InteractionMapper.toLikePostParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });
  });

  describe('toUnlikePostParams', () => {
    it('should convert DeleteLikePostCommandDTO to params', () => {
      const dto: DeleteLikePostCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = InteractionMapper.toUnlikePostParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });
  });

  describe('toGetUserLikesParams', () => {
    it('should convert GetUserLikesQueryDTO without pagination', () => {
      const dto: GetUserLikesQueryDTO = { userId: 'user-123' };
      const result = InteractionMapper.toGetUserLikesParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetUserLikesQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetUserLikesQueryDTO = {
        userId: 'user-123',
        pagination,
      };
      const result = InteractionMapper.toGetUserLikesParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });

    it('should handle multiple pages', () => {
      const pagination: PaginationRequestDTO = { page: 5, limit: 20 };
      const dto: GetUserLikesQueryDTO = {
        userId: 'user-456',
        pagination,
      };
      const result = InteractionMapper.toGetUserLikesParams(dto);

      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetPostLikersParams', () => {
    it('should convert GetPostLikersQueryDTO without pagination', () => {
      const dto: GetPostLikersQueryDTO = { postId: 'post-789' };
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
});
