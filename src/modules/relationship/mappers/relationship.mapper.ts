import { UserId } from '@volontariapp/domain-social';
import type { AuthUser } from '@volontariapp/auth';
import type {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
  AdminPostFollowUserCommandDTO,
  AdminDeleteFollowUserCommandDTO,
  AdminPostBlockUserCommandDTO,
  AdminDeleteBlockUserCommandDTO,
} from '../dto/relationship.command.dto.js';
import type {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
  AdminGetMyFollowsQueryDTO,
  AdminGetMyFollowersQueryDTO,
  AdminGetMyBlocksQueryDTO,
  AdminGetWhoBlockedMeQueryDTO,
} from '../dto/relationship.query.dto.js';
import { PaginationMapper } from '../../../common/mappers/pagination.mapper.js';

export class RelationshipMapper {
  static toFollowUserParams(
    dto: PostFollowUserCommandDTO,
    user: AuthUser,
  ): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(user.id),
      followedId: new UserId(dto.followedId),
    };
  }

  static toUnfollowUserParams(
    dto: DeleteFollowUserCommandDTO,
    user: AuthUser,
  ): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(user.id),
      followedId: new UserId(dto.followedId),
    };
  }

  static toBlockUserParams(
    dto: PostBlockUserCommandDTO,
    user: AuthUser,
  ): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(user.id),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toUnblockUserParams(
    dto: DeleteBlockUserCommandDTO,
    user: AuthUser,
  ): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(user.id),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toAdminFollowUserParams(dto: AdminPostFollowUserCommandDTO): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(dto.followerId),
      followedId: new UserId(dto.followedId),
    };
  }

  static toAdminUnfollowUserParams(dto: AdminDeleteFollowUserCommandDTO): {
    followerId: UserId;
    followedId: UserId;
  } {
    return {
      followerId: new UserId(dto.followerId),
      followedId: new UserId(dto.followedId),
    };
  }

  static toAdminBlockUserParams(dto: AdminPostBlockUserCommandDTO): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(dto.blockerId),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toAdminUnblockUserParams(dto: AdminDeleteBlockUserCommandDTO): {
    blockerId: UserId;
    blockedId: UserId;
  } {
    return {
      blockerId: new UserId(dto.blockerId),
      blockedId: new UserId(dto.blockedId),
    };
  }

  static toGetFollowsParams(
    dto: GetMyFollowsQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetFollowersParams(
    dto: GetMyFollowersQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetBlocksParams(
    dto: GetMyBlocksQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetWhoBlockedMeParams(
    dto: GetWhoBlockedMeQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetFollowsParams(dto: AdminGetMyFollowsQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetFollowersParams(dto: AdminGetMyFollowersQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetBlocksParams(dto: AdminGetMyBlocksQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetWhoBlockedMeParams(dto: AdminGetWhoBlockedMeQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
