import { UserId, PaginationVO } from '@volontariapp/domain-social';
import { RelationshipMapper } from '../../../../modules/social/mappers/relationship.mapper';
import {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
} from '../../../../modules/social/dto/request/command/relationship.command.dto';
import {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
} from '../../../../modules/social/dto/request/query/relationship.query.dto';
import { PaginationRequestDTO } from '../../../../modules/social/dto/common/pagination.dto';

describe('RelationshipMapper', () => {
  describe('toFollowUserParams', () => {
    it('should convert PostFollowUserCommandDTO to params', () => {
      const dto: PostFollowUserCommandDTO = {
        followerId: 'user-123',
        followedId: 'user-456',
      };
      const result = RelationshipMapper.toFollowUserParams(dto);

      expect(result.followerId).toBeInstanceOf(UserId);
      expect(result.followedId).toBeInstanceOf(UserId);
    });
  });

  describe('toUnfollowUserParams', () => {
    it('should convert DeleteFollowUserCommandDTO to params', () => {
      const dto: DeleteFollowUserCommandDTO = {
        followerId: 'user-123',
        followedId: 'user-456',
      };
      const result = RelationshipMapper.toUnfollowUserParams(dto);

      expect(result.followerId).toBeInstanceOf(UserId);
      expect(result.followedId).toBeInstanceOf(UserId);
    });
  });

  describe('toBlockUserParams', () => {
    it('should convert PostBlockUserCommandDTO to params', () => {
      const dto: PostBlockUserCommandDTO = {
        blockerId: 'user-123',
        blockedId: 'user-789',
      };
      const result = RelationshipMapper.toBlockUserParams(dto);

      expect(result.blockerId).toBeInstanceOf(UserId);
      expect(result.blockedId).toBeInstanceOf(UserId);
    });

    it('should handle blocking different users', () => {
      const dto1: PostBlockUserCommandDTO = {
        blockerId: 'user-1',
        blockedId: 'user-2',
      };
      const dto2: PostBlockUserCommandDTO = {
        blockerId: 'user-1',
        blockedId: 'user-3',
      };

      const result1 = RelationshipMapper.toBlockUserParams(dto1);
      const result2 = RelationshipMapper.toBlockUserParams(dto2);

      expect(result1.blockerId).toBeInstanceOf(UserId);
      expect(result2.blockerId).toBeInstanceOf(UserId);
    });
  });

  describe('toUnblockUserParams', () => {
    it('should convert DeleteBlockUserCommandDTO to params', () => {
      const dto: DeleteBlockUserCommandDTO = {
        blockerId: 'user-123',
        blockedId: 'user-789',
      };
      const result = RelationshipMapper.toUnblockUserParams(dto);

      expect(result.blockerId).toBeInstanceOf(UserId);
      expect(result.blockedId).toBeInstanceOf(UserId);
    });
  });

  describe('toGetFollowsParams', () => {
    it('should convert GetMyFollowsQueryDTO without pagination', () => {
      const dto: GetMyFollowsQueryDTO = { userId: 'user-123' };
      const result = RelationshipMapper.toGetFollowsParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyFollowsQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetMyFollowsQueryDTO = {
        userId: 'user-123',
        pagination,
      };
      const result = RelationshipMapper.toGetFollowsParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetFollowersParams', () => {
    it('should convert GetMyFollowersQueryDTO without pagination', () => {
      const dto: GetMyFollowersQueryDTO = { userId: 'user-456' };
      const result = RelationshipMapper.toGetFollowersParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyFollowersQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 2, limit: 20 };
      const dto: GetMyFollowersQueryDTO = {
        userId: 'user-456',
        pagination,
      };
      const result = RelationshipMapper.toGetFollowersParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetBlocksParams', () => {
    it('should convert GetMyBlocksQueryDTO without pagination', () => {
      const dto: GetMyBlocksQueryDTO = { userId: 'user-789' };
      const result = RelationshipMapper.toGetBlocksParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyBlocksQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetMyBlocksQueryDTO = {
        userId: 'user-789',
        pagination,
      };
      const result = RelationshipMapper.toGetBlocksParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetWhoBlockedMeParams', () => {
    it('should convert GetWhoBlockedMeQueryDTO without pagination', () => {
      const dto: GetWhoBlockedMeQueryDTO = { userId: 'user-101' };
      const result = RelationshipMapper.toGetWhoBlockedMeParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetWhoBlockedMeQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetWhoBlockedMeQueryDTO = {
        userId: 'user-101',
        pagination,
      };
      const result = RelationshipMapper.toGetWhoBlockedMeParams(dto);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });
});
