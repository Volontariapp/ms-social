import { PostId, EventId } from '@volontariapp/domain-social';
import type {
  LinkPostToEventCommandDTO,
  UnlinkPostFromEventCommandDTO,
} from '../dto/event-post-link.command.dto.js';
import type {
  GetEventRelatedToPostQueryDTO,
  GetEventPostsQueryDTO,
} from '../dto/event-post-link.query.dto.js';
import { PaginationMapper } from '../../../common/mappers/pagination.mapper.js';

export class EventPostLinkMapper {
  static toLinkPostToEventParams(dto: LinkPostToEventCommandDTO): {
    postId: PostId;
    eventId: EventId;
  } {
    return {
      postId: new PostId(dto.postId),
      eventId: new EventId(dto.eventId),
    };
  }

  static toUnlinkPostFromEventParams(dto: UnlinkPostFromEventCommandDTO): {
    postId: PostId;
    eventId: EventId;
  } {
    return {
      postId: new PostId(dto.postId),
      eventId: new EventId(dto.eventId),
    };
  }

  static toGetEventRelatedToPostParams(dto: GetEventRelatedToPostQueryDTO): PostId {
    return new PostId(dto.postId);
  }

  static toGetEventPostsParams(dto: GetEventPostsQueryDTO): {
    eventId: EventId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      eventId: new EventId(dto.eventId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
