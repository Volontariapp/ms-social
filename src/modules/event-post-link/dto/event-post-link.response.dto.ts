import type {
  LinkPostToEventResponse,
  UnlinkPostFromEventResponse,
  GetEventRelatedToPostResponse,
  GetEventPostsResponse,
} from '@volontariapp/contracts-nest';
import {
  SuccessResponseDTO,
  IdResponseDTO,
  IdsResponseDTO,
} from '../../../common/dto/base.response.dto.js';

export class LinkPostToEventResponseDTO
  extends SuccessResponseDTO
  implements LinkPostToEventResponse {}
export class UnlinkPostFromEventResponseDTO
  extends SuccessResponseDTO
  implements UnlinkPostFromEventResponse {}

export class GetEventRelatedToPostResponseDTO
  extends IdResponseDTO
  implements GetEventRelatedToPostResponse {}
export class GetEventPostsResponseDTO extends IdsResponseDTO implements GetEventPostsResponse {}
