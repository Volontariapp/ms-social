import type {
  CreateEventNodeResponse,
  DeleteEventNodeResponse,
  PostUserEventResponse,
  DeleteUserEventResponse,
  PostUserParticipateEventResponse,
  DeleteUserParticipateEventResponse,
  PostUserWishEventResponse,
  DeleteUserWishEventResponse,
  AdminPostUserParticipateEventResponse,
  AdminDeleteUserParticipateEventResponse,
  AdminPostUserWishEventResponse,
  AdminDeleteUserWishEventResponse,
  GetEventNodeResponse,
  GetUserEventResponse,
  GetUserParticipateEventResponse,
  GetUserWishEventResponse,
  AdminGetUserEventResponse,
  AdminGetUserParticipateEventResponse,
  AdminGetUserWishEventResponse,
  GetEventParticipantsResponse,
  GetRecommendedEventIdsResponse,
} from '@volontariapp/contracts-nest';
import {
  SuccessResponseDTO,
  ExistsResponseDTO,
  IdsResponseDTO,
} from '../../../common/dto/base.response.dto.js';

export class CreateEventNodeResponseDTO
  extends SuccessResponseDTO
  implements CreateEventNodeResponse {}
export class DeleteEventNodeResponseDTO
  extends SuccessResponseDTO
  implements DeleteEventNodeResponse {}
export class PostUserEventResponseDTO extends SuccessResponseDTO implements PostUserEventResponse {}
export class DeleteUserEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserEventResponse {}
export class PostUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements PostUserParticipateEventResponse {}
export class DeleteUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserParticipateEventResponse {}
export class AdminPostUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements AdminPostUserParticipateEventResponse {}
export class AdminDeleteUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteUserParticipateEventResponse {}
export class PostUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements PostUserWishEventResponse {}
export class DeleteUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserWishEventResponse {}
export class AdminPostUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements AdminPostUserWishEventResponse {}
export class AdminDeleteUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements AdminDeleteUserWishEventResponse {}

export class GetUserEventResponseDTO extends IdsResponseDTO implements GetUserEventResponse {}
export class GetUserParticipateEventResponseDTO
  extends IdsResponseDTO
  implements GetUserParticipateEventResponse {}
export class GetUserWishEventResponseDTO
  extends IdsResponseDTO
  implements GetUserWishEventResponse {}
export class AdminGetUserEventResponseDTO
  extends IdsResponseDTO
  implements AdminGetUserEventResponse {}
export class AdminGetUserParticipateEventResponseDTO
  extends IdsResponseDTO
  implements AdminGetUserParticipateEventResponse {}
export class AdminGetUserWishEventResponseDTO
  extends IdsResponseDTO
  implements AdminGetUserWishEventResponse {}
export class GetEventParticipantsResponseDTO
  extends IdsResponseDTO
  implements GetEventParticipantsResponse {}
export class GetEventNodeResponseDTO extends ExistsResponseDTO implements GetEventNodeResponse {}
export class GetRecommendedEventIdsResponseDTO
  extends IdsResponseDTO
  implements GetRecommendedEventIdsResponse {}
