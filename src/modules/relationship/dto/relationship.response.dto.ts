import type {
  PostFollowUserResponse,
  DeleteFollowUserResponse,
  PostBlockUserResponse,
  DeleteBlockUserResponse,
  AdminPostFollowUserResponse,
  AdminDeleteFollowUserResponse,
  AdminPostBlockUserResponse,
  AdminDeleteBlockUserResponse,
  GetMyFollowsResponse,
  GetMyFollowersResponse,
  GetMyBlocksResponse,
  GetWhoBlockedMeResponse,
  AdminGetMyFollowsResponse,
  AdminGetMyFollowersResponse,
  AdminGetMyBlocksResponse,
  AdminGetWhoBlockedMeResponse,
} from '@volontariapp/contracts-nest';
import { SuccessResponseDTO, IdsResponseDTO } from '../../../common/dto/base.response.dto.js';

export class PostFollowUserResponseDTO
  extends SuccessResponseDTO
  implements PostFollowUserResponse {}
export class DeleteFollowUserResponseDTO
  extends SuccessResponseDTO
  implements DeleteFollowUserResponse {}
export class PostBlockUserResponseDTO extends SuccessResponseDTO implements PostBlockUserResponse {}
export class DeleteBlockUserResponseDTO
  extends SuccessResponseDTO
  implements DeleteBlockUserResponse {}
export class AdminPostFollowUserResponseDTO
  extends SuccessResponseDTO
  implements AdminPostFollowUserResponse {}
export class AdminDeleteFollowUserResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteFollowUserResponse {}
export class AdminPostBlockUserResponseDTO
  extends SuccessResponseDTO
  implements AdminPostBlockUserResponse {}
export class AdminDeleteBlockUserResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteBlockUserResponse {}

export class GetMyFollowsResponseDTO extends IdsResponseDTO implements GetMyFollowsResponse {}
export class GetMyFollowersResponseDTO extends IdsResponseDTO implements GetMyFollowersResponse {}
export class GetMyBlocksResponseDTO extends IdsResponseDTO implements GetMyBlocksResponse {}
export class GetWhoBlockedMeResponseDTO extends IdsResponseDTO implements GetWhoBlockedMeResponse {}
export class AdminGetMyFollowsResponseDTO
  extends IdsResponseDTO
  implements AdminGetMyFollowsResponse {}
export class AdminGetMyFollowersResponseDTO
  extends IdsResponseDTO
  implements AdminGetMyFollowersResponse {}
export class AdminGetMyBlocksResponseDTO
  extends IdsResponseDTO
  implements AdminGetMyBlocksResponse {}
export class AdminGetWhoBlockedMeResponseDTO
  extends IdsResponseDTO
  implements AdminGetWhoBlockedMeResponse {}
