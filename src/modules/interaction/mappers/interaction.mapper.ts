import { UserId, PostId } from '@volontariapp/domain-social';
import type { PostLikeSummaryVO } from '@volontariapp/domain-social';
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
  GetPostsLikeSummaryQueryDTO,
} from '../dto/interaction.query.dto.js';
import type {
  PostLikeSummaryDTO,
  GetPostsLikeSummaryResponseDTO,
} from '../dto/interaction.response.dto.js';
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

  // Mapping des parametres pour le resume des likes par lot de publications
  static toGetPostsLikeSummaryParams(
    dto: GetPostsLikeSummaryQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    postIds: PostId[];
  } {
    return {
      userId: new UserId(user.id),
      postIds: dto.postIds.map((id) => new PostId(id)),
    };
  }

  // Mapping d un resume de likes vers le DTO de reponse
  static toPostLikeSummaryDTO(vo: PostLikeSummaryVO): PostLikeSummaryDTO {
    return {
      postId: vo.postId,
      likeCount: vo.likeCount,
      likedByMe: vo.likedByMe,
    };
  }

  // Mapping de la liste des resumes vers le DTO de reponse
  static toGetPostsLikeSummaryResponseDTO(
    summaries: PostLikeSummaryVO[],
  ): GetPostsLikeSummaryResponseDTO {
    return {
      summaries: summaries.map((vo) => this.toPostLikeSummaryDTO(vo)),
    };
  }
}
