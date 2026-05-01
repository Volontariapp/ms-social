import { PostId, UserId } from '@volontariapp/domain-social';
import type {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../dto/request/command/publication.command.dto.js';
import type {
  GetSocialPostQueryDTO,
  GetUserPostsQueryDTO,
  GetFeedQueryDTO,
} from '../dto/request/query/publication.query.dto.js';
import { PaginationMapper } from './pagination.mapper.js';

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

  static toOwnPostCommandParams(dto: PostUserOwnCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toDisownPostCommandParams(dto: DeleteUserOwnCommandDTO): {
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

  static toGetUserPostsQueryParams(dto: GetUserPostsQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetFeedQueryParams(dto: GetFeedQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
