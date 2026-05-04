import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, PARTICIPATION_METHODS } from '@volontariapp/contracts-nest';
import { ParticipationService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetSocialEventQueryDTO,
  GetUserEventQueryDTO,
  GetUserParticipateEventQueryDTO,
  GetEventParticipantsQueryDTO,
  GetUserWishEventQueryDTO,
  AdminGetUserEventQueryDTO,
  AdminGetUserParticipateEventQueryDTO,
  AdminGetUserWishEventQueryDTO,
} from '../dto/participation.query.dto.js';
import {
  GetEventNodeResponseDTO,
  GetUserEventResponseDTO,
  GetUserParticipateEventResponseDTO,
  GetEventParticipantsResponseDTO,
  GetUserWishEventResponseDTO,
  AdminGetUserEventResponseDTO,
  AdminGetUserParticipateEventResponseDTO,
  AdminGetUserWishEventResponseDTO,
} from '../dto/participation.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';
import { PaginatedIdsMapper } from '../../../common/mappers/paginated-ids.mapper.js';

@Controller()
export class ParticipationQueryController {
  private readonly logger = new Logger({
    context: ParticipationQueryController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE, PARTICIPATION_METHODS.GET_EVENT_NODE)
  async getEventNode(@Payload() data: GetSocialEventQueryDTO): Promise<GetEventNodeResponseDTO> {
    this.logger.log(`gRPC: Checking social event node existence: ${data.eventId}`);
    const eventId = ParticipationMapper.toGetEventNodeParams(data);
    const exists = await this.service.getEventExists(eventId);
    return { exists };
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE, PARTICIPATION_METHODS.GET_USER_EVENT)
  async getUserEvent(
    @Payload() data: GetUserEventQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetUserEventResponseDTO> {
    this.logger.log(`gRPC: Getting events created by user: ${user.id}`);
    const { userId, pagination } = ParticipationMapper.toGetUserEventsParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserEvents(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_USER_PARTICIPATE_EVENT,
  )
  async getUserParticipateEvent(
    @Payload() data: GetUserParticipateEventQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: Getting events participated by user: ${user.id}`);
    const { userId, pagination } = ParticipationMapper.toGetUserParticipationsParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserParticipations(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_EVENT_PARTICIPANTS,
  )
  async getEventParticipants(
    @Payload() data: GetEventParticipantsQueryDTO,
  ): Promise<GetEventParticipantsResponseDTO> {
    this.logger.log(`gRPC: Getting participants for event: ${data.eventId}`);
    const { eventId, pagination } = ParticipationMapper.toGetEventParticipantsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getEventParticipants(eventId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE, PARTICIPATION_METHODS.GET_USER_WISH_EVENT)
  async getUserWishEvent(
    @Payload() data: GetUserWishEventQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetUserWishEventResponseDTO> {
    this.logger.log(`gRPC: Getting wished events for user: ${user.id}`);
    const { userId, pagination } = ParticipationMapper.toGetUserWishEventsParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserWishes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE, PARTICIPATION_METHODS.ADMIN_GET_USER_EVENT)
  async adminGetUserEvent(
    @Payload() data: AdminGetUserEventQueryDTO,
  ): Promise<AdminGetUserEventResponseDTO> {
    this.logger.log(`gRPC: Admin getting events created by user: ${data.userId}`);
    const { userId, pagination } = ParticipationMapper.toAdminGetUserEventsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserEvents(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.ADMIN_GET_USER_PARTICIPATE_EVENT,
  )
  async adminGetUserParticipateEvent(
    @Payload() data: AdminGetUserParticipateEventQueryDTO,
  ): Promise<AdminGetUserParticipateEventResponseDTO> {
    this.logger.log(`gRPC: Admin getting events participated by user: ${data.userId}`);
    const { userId, pagination } = ParticipationMapper.toAdminGetUserParticipationsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserParticipations(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.ADMIN_GET_USER_WISH_EVENT,
  )
  async adminGetUserWishEvent(
    @Payload() data: AdminGetUserWishEventQueryDTO,
  ): Promise<AdminGetUserWishEventResponseDTO> {
    this.logger.log(`gRPC: Admin getting wished events for user: ${data.userId}`);
    const { userId, pagination } = ParticipationMapper.toAdminGetUserWishEventsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserWishes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
