import type {
  PostLikePostResponse,
  DeleteLikePostResponse,
  AdminPostLikePostResponse,
  AdminDeleteLikePostResponse,
  GetUserLikesResponse,
  GetPostLikersResponse,
  AdminGetUserLikesResponse,
} from '@volontariapp/contracts-nest';
import { SuccessResponseDTO, IdsResponseDTO } from '../../../common/dto/base.response.dto.js';

export class PostLikePostResponseDTO extends SuccessResponseDTO implements PostLikePostResponse {}
export class DeleteLikePostResponseDTO
  extends SuccessResponseDTO
  implements DeleteLikePostResponse {}
export class AdminPostLikePostResponseDTO
  extends SuccessResponseDTO
  implements AdminPostLikePostResponse {}
export class AdminDeleteLikePostResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteLikePostResponse {}

export class GetUserLikesResponseDTO extends IdsResponseDTO implements GetUserLikesResponse {}
export class GetPostLikersResponseDTO extends IdsResponseDTO implements GetPostLikersResponse {}
export class AdminGetUserLikesResponseDTO
  extends IdsResponseDTO
  implements AdminGetUserLikesResponse {}
