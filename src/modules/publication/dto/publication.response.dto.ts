import type {
  CreatePostNodeResponse,
  DeletePostNodeResponse,
  PostUserOwnResponse,
  DeleteUserOwnResponse,
  AdminPostUserOwnResponse,
  AdminDeleteUserOwnResponse,
  GetPostNodeResponse,
  GetUserPostsResponse,
  GetFeedResponse,
  AdminGetUserPostsResponse,
  AdminGetFeedResponse,
} from '@volontariapp/contracts-nest';
import {
  SuccessResponseDTO,
  ExistsResponseDTO,
  IdsResponseDTO,
} from '../../../common/dto/base.response.dto.js';

export class CreatePostNodeResponseDTO
  extends SuccessResponseDTO
  implements CreatePostNodeResponse {}
export class DeletePostNodeResponseDTO
  extends SuccessResponseDTO
  implements DeletePostNodeResponse {}
export class PostUserOwnResponseDTO extends SuccessResponseDTO implements PostUserOwnResponse {}
export class DeleteUserOwnResponseDTO extends SuccessResponseDTO implements DeleteUserOwnResponse {}
export class AdminPostUserOwnResponseDTO
  extends SuccessResponseDTO
  implements AdminPostUserOwnResponse {}
export class AdminDeleteUserOwnResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteUserOwnResponse {}

export class GetPostNodeResponseDTO extends ExistsResponseDTO implements GetPostNodeResponse {}
export class GetUserPostsResponseDTO extends IdsResponseDTO implements GetUserPostsResponse {}
export class GetFeedResponseDTO extends IdsResponseDTO implements GetFeedResponse {}
export class AdminGetUserPostsResponseDTO
  extends IdsResponseDTO
  implements AdminGetUserPostsResponse {}
export class AdminGetFeedResponseDTO extends IdsResponseDTO implements AdminGetFeedResponse {}
