import type {
  CreateUserNodeResponse,
  DeleteUserNodeResponse,
  GetUserNodeResponse,
  PostFollowUserResponse,
  DeleteFollowUserResponse,
  PostBlockUserResponse,
  DeleteBlockUserResponse,
  GetMyFollowsResponse,
  GetMyFollowersResponse,
  GetMyBlocksResponse,
  GetWhoBlockedMeResponse,
  CreatePostNodeResponse,
  DeletePostNodeResponse,
  PostUserOwnResponse,
  DeleteUserOwnResponse,
  GetPostNodeResponse,
  GetUserPostsResponse,
  GetFeedResponse,
  PostLikePostResponse,
  DeleteLikePostResponse,
  GetUserLikesResponse,
  GetPostLikersResponse,
  CreateEventNodeResponse,
  DeleteEventNodeResponse,
  PostUserEventResponse,
  DeleteUserEventResponse,
  PostUserParticipateEventResponse,
  DeleteUserParticipateEventResponse,
  PostUserWishEventResponse,
  DeleteUserWishEventResponse,
  GetEventNodeResponse,
  GetUserEventResponse,
  GetUserParticipateEventResponse,
  GetUserWishEventResponse,
  GetEventParticipantsResponse,
  LinkPostToEventResponse,
  UnlinkPostFromEventResponse,
  GetEventRelatedToPostResponse,
  GetEventPostsResponse,
} from '@volontariapp/contracts-nest';
import type { PaginationResponseDTO } from './pagination-response.dto.js';

export class SuccessResponseDTO {
  success: boolean = true;
}

export class ExistsResponseDTO {
  exists!: boolean;
}

export class IdsResponseDTO {
  ids!: string[];
  pagination: PaginationResponseDTO | undefined;
}

export class IdResponseDTO {
  eventId!: string;
}

// Group 1: User Node
export class CreateUserNodeResponseDTO
  extends SuccessResponseDTO
  implements CreateUserNodeResponse {}
export class DeleteUserNodeResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserNodeResponse {}
export class GetUserNodeResponseDTO
  extends ExistsResponseDTO
  implements GetUserNodeResponse {}

// Group 2: Relationships
export class PostFollowUserResponseDTO
  extends SuccessResponseDTO
  implements PostFollowUserResponse {}
export class DeleteFollowUserResponseDTO
  extends SuccessResponseDTO
  implements DeleteFollowUserResponse {}
export class PostBlockUserResponseDTO
  extends SuccessResponseDTO
  implements PostBlockUserResponse {}
export class DeleteBlockUserResponseDTO
  extends SuccessResponseDTO
  implements DeleteBlockUserResponse {}

export class GetMyFollowsResponseDTO
  extends IdsResponseDTO
  implements GetMyFollowsResponse {}
export class GetMyFollowersResponseDTO
  extends IdsResponseDTO
  implements GetMyFollowersResponse {}
export class GetMyBlocksResponseDTO
  extends IdsResponseDTO
  implements GetMyBlocksResponse {}
export class GetWhoBlockedMeResponseDTO
  extends IdsResponseDTO
  implements GetWhoBlockedMeResponse {}

// Group 3: Publications
export class CreatePostNodeResponseDTO
  extends SuccessResponseDTO
  implements CreatePostNodeResponse {}
export class DeletePostNodeResponseDTO
  extends SuccessResponseDTO
  implements DeletePostNodeResponse {}
export class PostUserOwnResponseDTO
  extends SuccessResponseDTO
  implements PostUserOwnResponse {}
export class DeleteUserOwnResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserOwnResponse {}

export class GetPostNodeResponseDTO
  extends ExistsResponseDTO
  implements GetPostNodeResponse {}
export class GetUserPostsResponseDTO
  extends IdsResponseDTO
  implements GetUserPostsResponse {}
export class GetFeedResponseDTO
  extends IdsResponseDTO
  implements GetFeedResponse {}

// Group 4: Interactions
export class PostLikePostResponseDTO
  extends SuccessResponseDTO
  implements PostLikePostResponse {}
export class DeleteLikePostResponseDTO
  extends SuccessResponseDTO
  implements DeleteLikePostResponse {}

export class GetUserLikesResponseDTO
  extends IdsResponseDTO
  implements GetUserLikesResponse {}
export class GetPostLikersResponseDTO
  extends IdsResponseDTO
  implements GetPostLikersResponse {}

// Group 5: Participation
export class CreateEventNodeResponseDTO
  extends SuccessResponseDTO
  implements CreateEventNodeResponse {}
export class DeleteEventNodeResponseDTO
  extends SuccessResponseDTO
  implements DeleteEventNodeResponse {}
export class PostUserEventResponseDTO
  extends SuccessResponseDTO
  implements PostUserEventResponse {}
export class DeleteUserEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserEventResponse {}
export class PostUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements PostUserParticipateEventResponse {}
export class DeleteUserParticipateEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserParticipateEventResponse {}
export class PostUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements PostUserWishEventResponse {}
export class DeleteUserWishEventResponseDTO
  extends SuccessResponseDTO
  implements DeleteUserWishEventResponse {}

export class GetUserEventResponseDTO
  extends IdsResponseDTO
  implements GetUserEventResponse {}
export class GetUserParticipateEventResponseDTO
  extends IdsResponseDTO
  implements GetUserParticipateEventResponse {}
export class GetUserWishEventResponseDTO
  extends IdsResponseDTO
  implements GetUserWishEventResponse {}
export class GetEventParticipantsResponseDTO
  extends IdsResponseDTO
  implements GetEventParticipantsResponse {}
export class GetEventNodeResponseDTO
  extends ExistsResponseDTO
  implements GetEventNodeResponse {}

// Group 6: Event-Post Link
export class LinkPostToEventResponseDTO
  extends SuccessResponseDTO
  implements LinkPostToEventResponse {}
export class UnlinkPostFromEventResponseDTO
  extends SuccessResponseDTO
  implements UnlinkPostFromEventResponse {}

export class GetEventRelatedToPostResponseDTO
  extends IdResponseDTO
  implements GetEventRelatedToPostResponse {}
export class GetEventPostsResponseDTO
  extends IdsResponseDTO
  implements GetEventPostsResponse {}
