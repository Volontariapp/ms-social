import { PostId, UserId, PaginationVO } from '@volontariapp/domain-social';
import { PublicationMapper } from '../../../../modules/social/mappers/publication.mapper';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../../../../modules/social/dto/request/command/publication.command.dto';
import {
  GetSocialPostQueryDTO,
  GetUserPostsQueryDTO,
  GetFeedQueryDTO,
} from '../../../../modules/social/dto/request/query/publication.query.dto';
import { PaginationRequestDTO } from '../../../../modules/social/dto/common/pagination.dto';

describe('PublicationMapper', () => {
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
    it('should convert PostUserOwnCommandDTO to params with UserId and PostId', () => {
      const dto: PostUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = PublicationMapper.toOwnPostCommandParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });

    it('should preserve userId and postId', () => {
      const userId = 'specific-user';
      const postId = 'specific-post';
      const dto: PostUserOwnCommandDTO = { userId, postId };
      const result = PublicationMapper.toOwnPostCommandParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
    });
  });

  describe('toDisownPostCommandParams', () => {
    it('should convert DeleteUserOwnCommandDTO to params', () => {
      const dto: DeleteUserOwnCommandDTO = {
        userId: 'user-123',
        postId: 'post-456',
      };
      const result = PublicationMapper.toDisownPostCommandParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.postId).toBeInstanceOf(PostId);
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
      const dto: GetUserPostsQueryDTO = { userId: 'user-123' };
      const result = PublicationMapper.toGetUserPostsQueryParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetUserPostsQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetUserPostsQueryDTO = {
        userId: 'user-123',
        pagination,
      };
      const result = PublicationMapper.toGetUserPostsQueryParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetFeedQueryParams', () => {
    it('should convert GetFeedQueryDTO without pagination', () => {
      const dto: GetFeedQueryDTO = { userId: 'user-456' };
      const result = PublicationMapper.toGetFeedQueryParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetFeedQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 2, limit: 20 };
      const dto: GetFeedQueryDTO = {
        userId: 'user-456',
        pagination,
      };
      const result = PublicationMapper.toGetFeedQueryParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });
});
