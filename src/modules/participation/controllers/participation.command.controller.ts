import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
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
  AdminPostUserParticipateEventCommandDTO,
  AdminDeleteUserParticipateEventCommandDTO,
  AdminPostUserWishEventCommandDTO,
  AdminDeleteUserWishEventCommandDTO,
} from '../dto/participation.command.dto.js';
import {
  CreateEventNodeResponseDTO,
  DeleteEventNodeResponseDTO,
  PostUserEventResponseDTO,
  DeleteUserEventResponseDTO,
  PostUserParticipateEventResponseDTO,
  DeleteUserParticipateEventResponseDTO,
  PostUserWishEventResponseDTO,
  DeleteUserWishEventResponseDTO,
  AdminPostUserParticipateEventResponseDTO,
  AdminDeleteUserParticipateEventResponseDTO,
  AdminPostUserWishEventResponseDTO,
  AdminDeleteUserWishEventResponseDTO,
} from '../dto/participation.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';

@Controller()
export class ParticipationCommandController {
  private readonly logger = new Logger({
    context: ParticipationCommandController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.CREATE_EVENT_NODE)
  async createEventNode(
    @Payload() data: CreateSocialEventCommandDTO,
  ): Promise<CreateEventNodeResponseDTO> {
    this.logger.log(`gRPC: Creating event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toCreateEventParams(data);
    await this.service.createEvent(eventId);
    return new CreateEventNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.DELETE_EVENT_NODE)
  async deleteEventNode(
    @Payload() data: DeleteSocialEventCommandDTO,
  ): Promise<DeleteEventNodeResponseDTO> {
    this.logger.log(`gRPC: Deleting event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toDeleteEventParams(data);
    await this.service.deleteEvent(eventId);
    return new DeleteEventNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.POST_USER_EVENT)
  async postUserEvent(@Payload() data: PostUserEventCommandDTO): Promise<PostUserEventResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} created event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toSetEventCreatorParams(data);
    await this.service.setEventCreator(userId, eventId);
    return new PostUserEventResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE, PARTICIPATION_METHODS.DELETE_USER_EVENT)
  async deleteUserEvent(
    @Payload() data: DeleteUserEventCommandDTO,
  ): Promise<DeleteUserEventResponseDTO> {
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
    @Payload() data: PostUserParticipateEventCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} participating to event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toParticipateEventParams(data, user);
    await this.service.participateEvent(userId, eventId);
    return new PostUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_USER_PARTICIPATE_EVENT,
  )
  async deleteUserParticipateEvent(
    @Payload() data: DeleteUserParticipateEventCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} unparticipating from event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toLeaveEventParams(data, user);
    await this.service.leaveEvent(userId, eventId);
    return new DeleteUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.POST_USER_WISH_EVENT,
  )
  async postUserWishEvent(
    @Payload() data: PostUserWishEventCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostUserWishEventResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} wishing for event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toWishEventParams(data, user);
    await this.service.wishEvent(userId, eventId);
    return new PostUserWishEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_USER_WISH_EVENT,
  )
  async deleteUserWishEvent(
    @Payload() data: DeleteUserWishEventCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteUserWishEventResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} unwishing from event ${data.eventId}`);
    const { userId, eventId } = ParticipationMapper.toUnwishEventParams(data, user);
    await this.service.unwishEvent(userId, eventId);
    return new DeleteUserWishEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.ADMIN_POST_USER_PARTICIPATE_EVENT,
  )
  async adminPostUserParticipateEvent(
    @Payload() data: AdminPostUserParticipateEventCommandDTO,
  ): Promise<AdminPostUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: Admin user participating to event ${data.eventId} for user ${data.userId}`,
    );
    const { userId, eventId } = ParticipationMapper.toAdminParticipateEventParams(data);
    await this.service.participateEvent(userId, eventId);
    return new AdminPostUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.ADMIN_DELETE_USER_PARTICIPATE_EVENT,
  )
  async adminDeleteUserParticipateEvent(
    @Payload() data: AdminDeleteUserParticipateEventCommandDTO,
  ): Promise<AdminDeleteUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: Admin user unparticipating from event ${data.eventId} for user ${data.userId}`,
    );
    const { userId, eventId } = ParticipationMapper.toAdminLeaveEventParams(data);
    await this.service.leaveEvent(userId, eventId);
    return new AdminDeleteUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.ADMIN_POST_USER_WISH_EVENT,
  )
  async adminPostUserWishEvent(
    @Payload() data: AdminPostUserWishEventCommandDTO,
  ): Promise<AdminPostUserWishEventResponseDTO> {
    this.logger.log(`gRPC: Admin user wishing for event ${data.eventId} for user ${data.userId}`);
    const { userId, eventId } = ParticipationMapper.toAdminWishEventParams(data);
    await this.service.wishEvent(userId, eventId);
    return new AdminPostUserWishEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.ADMIN_DELETE_USER_WISH_EVENT,
  )
  async adminDeleteUserWishEvent(
    @Payload() data: AdminDeleteUserWishEventCommandDTO,
  ): Promise<AdminDeleteUserWishEventResponseDTO> {
    this.logger.log(
      `gRPC: Admin user unwishing from event ${data.eventId} for user ${data.userId}`,
    );
    const { userId, eventId } = ParticipationMapper.toAdminUnwishEventParams(data);
    await this.service.unwishEvent(userId, eventId);
    return new AdminDeleteUserWishEventResponseDTO();
  }
}
