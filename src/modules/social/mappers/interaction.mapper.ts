import { UserId, PostId } from '@volontariapp/domain-social';
import type {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
} from '../dto/request/command/interaction.command.dto.js';
import type {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
} from '../dto/request/query/interaction.query.dto.js';
import { PaginationMapper } from './pagination.mapper.js';

export class InteractionMapper {
  static toLikePostParams(dto: PostLikePostCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toUnlikePostParams(dto: DeleteLikePostCommandDTO): {
    userId: UserId;
    postId: PostId;
  } {
    return {
      userId: new UserId(dto.userId),
      postId: new PostId(dto.postId),
    };
  }

  static toGetUserLikesParams(dto: GetUserLikesQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination
        ? PaginationMapper.toPaginationVO(dto.pagination)
        : undefined,
    };
  }

  static toGetPostLikersParams(dto: GetPostLikersQueryDTO): {
    postId: PostId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      postId: new PostId(dto.postId),
      pagination: dto.pagination
        ? PaginationMapper.toPaginationVO(dto.pagination)
        : undefined,
    };
  }
}
