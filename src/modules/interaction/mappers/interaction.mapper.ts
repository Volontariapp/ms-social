import { UserId, PostId } from '@volontariapp/domain-social';
import type { AuthUser } from '@volontariapp/auth';
import type {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
  AdminPostLikePostCommandDTO,
  AdminDeleteLikePostCommandDTO,
} from '../dto/interaction.command.dto.js';
import type {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
  AdminGetUserLikesQueryDTO,
} from '../dto/interaction.query.dto.js';
import { PaginationMapper } from '../../../common/mappers/pagination.mapper.js';

export class InteractionMapper {
  static toLikePostParams(
    dto: PostLikePostCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(user.id),
      postId: new PostId(dto.postId),
    };
  }

  static toUnlikePostParams(
    dto: DeleteLikePostCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(user.id),
      postId: new PostId(dto.postId),
    };
  }

  static toAdminLikePostParams(dto: AdminPostLikePostCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toAdminUnlikePostParams(dto: AdminDeleteLikePostCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toGetUserLikesParams(
    dto: GetUserLikesQueryDTO,
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

  static toAdminGetUserLikesParams(dto: AdminGetUserLikesQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetPostLikersParams(dto: GetPostLikersQueryDTO): {
    postId: PostId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      postId: new PostId(dto.postId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
