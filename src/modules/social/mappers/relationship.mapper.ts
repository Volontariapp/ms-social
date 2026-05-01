import { UserId } from '@volontariapp/domain-social';
import type {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
} from '../dto/request/command/relationship.command.dto.js';
import type {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
} from '../dto/request/query/relationship.query.dto.js';
import { PaginationMapper } from './pagination.mapper.js';

export class RelationshipMapper {
  static toFollowUserParams(dto: PostFollowUserCommandDTO): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(dto.followerId),
      followedId: new UserId(dto.followedId),
    };
  }

  static toUnfollowUserParams(dto: DeleteFollowUserCommandDTO): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(dto.followerId),
      followedId: new UserId(dto.followedId),
    };
  }

  static toBlockUserParams(dto: PostBlockUserCommandDTO): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(dto.blockerId),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toUnblockUserParams(dto: DeleteBlockUserCommandDTO): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(dto.blockerId),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toGetFollowsParams(dto: GetMyFollowsQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetFollowersParams(dto: GetMyFollowersQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetBlocksParams(dto: GetMyBlocksQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetWhoBlockedMeParams(dto: GetWhoBlockedMeQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
