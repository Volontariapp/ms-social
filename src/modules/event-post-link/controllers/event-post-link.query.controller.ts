import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, EVENT_POST_LINK_METHODS } from '@volontariapp/contracts-nest';
import { EventPostLinkService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetEventRelatedToPostQueryDTO,
  GetEventPostsQueryDTO,
} from '../dto/event-post-link.query.dto.js';
import {
  GetEventRelatedToPostResponseDTO,
  GetEventPostsResponseDTO,
} from '../dto/event-post-link.response.dto.js';
import { EventPostLinkMapper } from '../mappers/event-post-link.mapper.js';
import { PaginatedIdsMapper } from '../../../common/mappers/paginated-ids.mapper.js';

@Controller()
export class EventPostLinkQueryController {
  private readonly logger = new Logger({
    context: EventPostLinkQueryController.name,
  });

  constructor(private readonly service: EventPostLinkService) {}

  @GrpcMethod(
    GRPC_SERVICES.EVENT_POST_LINK_QUERY_SERVICE,
    EVENT_POST_LINK_METHODS.GET_EVENT_RELATED_TO_POST,
  )
  async getEventRelatedToPost(
    data: GetEventRelatedToPostQueryDTO,
  ): Promise<GetEventRelatedToPostResponseDTO> {
    this.logger.log(`gRPC: Getting event linked to post: ${data.postId}`);
    const postId = EventPostLinkMapper.toGetEventRelatedToPostParams(data);
    const eventId = await this.service.getEventRelatedToPost(postId);
    return { eventId: eventId ?? '' };
  }

  @GrpcMethod(GRPC_SERVICES.EVENT_POST_LINK_QUERY_SERVICE, EVENT_POST_LINK_METHODS.GET_EVENT_POSTS)
  async getEventPosts(data: GetEventPostsQueryDTO): Promise<GetEventPostsResponseDTO> {
    this.logger.log(`gRPC: Getting posts linked to event: ${data.eventId}`);
    const { eventId, pagination } = EventPostLinkMapper.toGetEventPostsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getEventPosts(eventId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
