import { UserId, PaginationVO } from '@volontariapp/domain-social';
import { RelationshipMapper } from '../../../modules/relationship/mappers/relationship.mapper.js';
import type {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
} from '../../../modules/relationship/dto/relationship.command.dto.js';
import type {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
} from '../../../modules/relationship/dto/relationship.query.dto.js';
import type { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';
import { createMockAuthUser } from '../../utils/mock.helper.js';
import { describe, it, expect } from '@jest/globals';

describe('RelationshipMapper', () => {
  const mockUser = createMockAuthUser();

  describe('toFollowUserParams', () => {
    it('should convert PostFollowUserCommandDTO and user to params', () => {
      const dto: PostFollowUserCommandDTO = {
        followedId: 'user-456',
      };
      const result = RelationshipMapper.toFollowUserParams(dto, mockUser);

      expect(result.followerId).toBeInstanceOf(UserId);
      expect(result.followerId.value).toBe(mockUser.id);
      expect(result.followedId).toBeInstanceOf(UserId);
      expect(result.followedId.value).toBe('user-456');
    });
  });

  describe('toUnfollowUserParams', () => {
    it('should convert DeleteFollowUserCommandDTO and user to params', () => {
      const dto: DeleteFollowUserCommandDTO = {
        followedId: 'user-456',
      };
      const result = RelationshipMapper.toUnfollowUserParams(dto, mockUser);

      expect(result.followerId).toBeInstanceOf(UserId);
      expect(result.followerId.value).toBe(mockUser.id);
      expect(result.followedId).toBeInstanceOf(UserId);
      expect(result.followedId.value).toBe('user-456');
    });
  });

  describe('toBlockUserParams', () => {
    it('should convert PostBlockUserCommandDTO and user to params', () => {
      const dto: PostBlockUserCommandDTO = {
        blockedId: 'user-789',
      };
      const result = RelationshipMapper.toBlockUserParams(dto, mockUser);

      expect(result.blockerId).toBeInstanceOf(UserId);
      expect(result.blockerId.value).toBe(mockUser.id);
      expect(result.blockedId).toBeInstanceOf(UserId);
      expect(result.blockedId.value).toBe('user-789');
    });
  });

  describe('toUnblockUserParams', () => {
    it('should convert DeleteBlockUserCommandDTO and user to params', () => {
      const dto: DeleteBlockUserCommandDTO = {
        blockedId: 'user-789',
      };
      const result = RelationshipMapper.toUnblockUserParams(dto, mockUser);

      expect(result.blockerId).toBeInstanceOf(UserId);
      expect(result.blockerId.value).toBe(mockUser.id);
      expect(result.blockedId).toBeInstanceOf(UserId);
      expect(result.blockedId.value).toBe('user-789');
    });
  });

  describe('toGetFollowsParams', () => {
    it('should convert GetMyFollowsQueryDTO without pagination', () => {
      const dto: GetMyFollowsQueryDTO = {
        pagination: undefined,
      };
      const result = RelationshipMapper.toGetFollowsParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyFollowsQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetMyFollowsQueryDTO = {
        pagination,
      };
      const result = RelationshipMapper.toGetFollowsParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetFollowersParams', () => {
    it('should convert GetMyFollowersQueryDTO without pagination', () => {
      const dto: GetMyFollowersQueryDTO = {
        pagination: undefined,
      };
      const result = RelationshipMapper.toGetFollowersParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyFollowersQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 2, limit: 20 };
      const dto: GetMyFollowersQueryDTO = {
        pagination,
      };
      const result = RelationshipMapper.toGetFollowersParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetBlocksParams', () => {
    it('should convert GetMyBlocksQueryDTO without pagination', () => {
      const dto: GetMyBlocksQueryDTO = {
        pagination: undefined,
      };
      const result = RelationshipMapper.toGetBlocksParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetMyBlocksQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetMyBlocksQueryDTO = {
        pagination,
      };
      const result = RelationshipMapper.toGetBlocksParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });

  describe('toGetWhoBlockedMeParams', () => {
    it('should convert GetWhoBlockedMeQueryDTO without pagination', () => {
      const dto: GetWhoBlockedMeQueryDTO = {
        pagination: undefined,
      };
      const result = RelationshipMapper.toGetWhoBlockedMeParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeUndefined();
    });

    it('should convert GetWhoBlockedMeQueryDTO with pagination', () => {
      const pagination: PaginationRequestDTO = { page: 1, limit: 10 };
      const dto: GetWhoBlockedMeQueryDTO = {
        pagination,
      };
      const result = RelationshipMapper.toGetWhoBlockedMeParams(dto, mockUser);

      expect(result.userId).toBeInstanceOf(UserId);
      expect(result.userId.value).toBe(mockUser.id);
      expect(result.pagination).toBeInstanceOf(PaginationVO);
    });
  });
});
