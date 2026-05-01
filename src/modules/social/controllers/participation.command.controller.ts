import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, PARTICIPATION_METHODS } from '@volontariapp/contracts-nest';
import { ParticipationService } from '@volontariapp/domain-social';
import {
  CreateSocialEventCommandDTO,
  DeleteSocialEventCommandDTO,
  PostUserEventCommandDTO,
  DeleteUserEventCommandDTO,
  PostUserParticipateEventCommandDTO,
  DeleteUserParticipateEventCommandDTO,
  PostUserWishEventCommandDTO,
  DeleteUserWishEventCommandDTO,
} from '../dto/request/command/participation.command.dto.js';
import {
  CreateEventNodeResponseDTO,
  DeleteEventNodeResponseDTO,
  PostUserEventResponseDTO,
  DeleteUserEventResponseDTO,
  PostUserParticipateEventResponseDTO,
  DeleteUserParticipateEventResponseDTO,
  PostUserWishEventResponseDTO,
  DeleteUserWishEventResponseDTO,
} from '../dto/response/social.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';

@Controller()
export class ParticipationCommandController {
  private readonly logger = new Logger({
    context: ParticipationCommandController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.CREATE_EVENT_NODE)
  async createEventNode(data: CreateSocialEventCommandDTO): Promise<CreateEventNodeResponseDTO> {
    this.logger.log(`gRPC: Creating event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toCreateEventParams(data);
    await this.service.createEvent(eventId);
    return new CreateEventNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.DELETE_EVENT_NODE)
  async deleteEventNode(data: DeleteSocialEventCommandDTO): Promise<DeleteEventNodeResponseDTO> {
    this.logger.log(`gRPC: Deleting event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toDeleteEventParams(data);
    await this.service.deleteEvent(eventId);
    return new DeleteEventNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.POST_USER_EVENT)
  async postUserEvent(data: PostUserEventCommandDTO): Promise<PostUserEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} created event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toSetEventCreatorParams(data);
    await this.service.setEventCreator(userId, eventId);
    return new PostUserEventResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.DELETE_USER_EVENT)
  async deleteUserEvent(data: DeleteUserEventCommandDTO): Promise<DeleteUserEventResponseDTO> {
    this.logger.log(
      `gRPC: User ${data.userId} unlinked from event ${data.eventId} (creation link)`,
    );
    const { userId, eventId } = ParticipationMapper.toRemoveEventCreatorParams(data);
    await this.service.removeEventCreator(userId, eventId);
    return new DeleteUserEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.POST_USER_PARTICIPATE_EVENT,
  )
  async postUserParticipateEvent(
    data: PostUserParticipateEventCommandDTO,
  ): Promise<PostUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} participating to event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toParticipateEventParams(data);
    await this.service.participateEvent(userId, eventId);
    return new PostUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_USER_PARTICIPATE_EVENT,
  )
  async deleteUserParticipateEvent(
    data: DeleteUserParticipateEventCommandDTO,
  ): Promise<DeleteUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} unparticipating from event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toLeaveEventParams(data);
    await this.service.leaveEvent(userId, eventId);
    return new DeleteUserParticipateEventResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, 'postUserWishEvent')
  async postUserWishEvent(
    data: PostUserWishEventCommandDTO,
  ): Promise<PostUserWishEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} wishing for event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toWishEventParams(data);
    await this.service.wishEvent(userId, eventId);
    return new PostUserWishEventResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, 'deleteUserWishEvent')
  async deleteUserWishEvent(
    data: DeleteUserWishEventCommandDTO,
  ): Promise<DeleteUserWishEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} unwishing from event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toUnwishEventParams(data);
    await this.service.unwishEvent(userId, eventId);
    return new DeleteUserWishEventResponseDTO();
  }
}
