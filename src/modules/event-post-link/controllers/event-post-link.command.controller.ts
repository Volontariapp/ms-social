import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { GRPC_SERVICES, EVENT_POST_LINK_METHODS } from '@volontariapp/contracts-nest';
import { EventPostLinkService } from '@volontariapp/domain-social';
import {
  LinkPostToEventCommandDTO,
  UnlinkPostFromEventCommandDTO,
} from '../dto/event-post-link.command.dto.js';
import {
  LinkPostToEventResponseDTO,
  UnlinkPostFromEventResponseDTO,
} from '../dto/event-post-link.response.dto.js';
import { EventPostLinkMapper } from '../mappers/event-post-link.mapper.js';

@Controller()
export class EventPostLinkCommandController {
  private readonly logger = new Logger({
    context: EventPostLinkCommandController.name,
  });

  constructor(private readonly service: EventPostLinkService) {}

  @GrpcMethod(
    GRPC_SERVICES.EVENT_POST_LINK_COMMAND_SERVICE,
    EVENT_POST_LINK_METHODS.LINK_POST_TO_EVENT,
  )
  async linkPostToEvent(
    @Payload() data: LinkPostToEventCommandDTO,
  ): Promise<LinkPostToEventResponseDTO> {
    this.logger.log(`gRPC: Linking post ${data.postId} to event ${data.eventId}`);
    const { postId, eventId } = EventPostLinkMapper.toLinkPostToEventParams(data);
    await this.service.linkPostToEvent(postId, eventId);
    return new LinkPostToEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.EVENT_POST_LINK_COMMAND_SERVICE,
    EVENT_POST_LINK_METHODS.UNLINK_POST_FROM_EVENT,
  )
  async unlinkPostFromEvent(
    @Payload() data: UnlinkPostFromEventCommandDTO,
  ): Promise<UnlinkPostFromEventResponseDTO> {
    this.logger.log(`gRPC: Unlinking post ${data.postId} from event ${data.eventId}`);
    const { postId, eventId } = EventPostLinkMapper.toUnlinkPostFromEventParams(data);
    await this.service.unlinkPostFromEvent(postId, eventId);
    return new UnlinkPostFromEventResponseDTO();
  }
}
