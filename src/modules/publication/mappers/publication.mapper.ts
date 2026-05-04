import { PostId, UserId } from '@volontariapp/domain-social';
import type { AuthUser } from '@volontariapp/auth';
import type {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
  AdminPostUserOwnCommandDTO,
  AdminDeleteUserOwnCommandDTO,
} from '../dto/publication.command.dto.js';
import type {
  GetSocialPostQueryDTO,
  GetUserPostsQueryDTO,
  GetFeedQueryDTO,
  AdminGetUserPostsQueryDTO,
  AdminGetFeedQueryDTO,
} from '../dto/publication.query.dto.js';
import { PaginationMapper } from '../../../common/mappers/pagination.mapper.js';

export class PublicationMapper {
  static toPostIdVO(postId: string): PostId {
    return new PostId(postId);
  }

  static toPostIdVOFromCommand(dto: CreateSocialPostCommandDTO): PostId {
    return this.toPostIdVO(dto.postId);
  }

  static toDeletePostIdVOFromCommand(dto: DeleteSocialPostCommandDTO): PostId {
    return this.toPostIdVO(dto.postId);
  }

  static toOwnPostCommandParams(
    dto: PostUserOwnCommandDTO,
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

  static toDisownPostCommandParams(
    dto: DeleteUserOwnCommandDTO,
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

  static toAdminOwnPostCommandParams(dto: AdminPostUserOwnCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toAdminDisownPostCommandParams(dto: AdminDeleteUserOwnCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toGetPostQueryParams(dto: GetSocialPostQueryDTO): PostId {
    return this.toPostIdVO(dto.postId);
  }

  static toGetUserPostsQueryParams(
    dto: GetUserPostsQueryDTO,
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

  static toGetFeedQueryParams(
    dto: GetFeedQueryDTO,
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

  static toAdminGetUserPostsQueryParams(dto: AdminGetUserPostsQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetFeedQueryParams(dto: AdminGetFeedQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
