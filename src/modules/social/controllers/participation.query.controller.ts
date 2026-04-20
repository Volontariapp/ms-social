import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  PARTICIPATION_METHODS,
} from '@volontariapp/contracts-nest';
import {
  ParticipationService,
  PaginationVO,
} from '@volontariapp/domain-social';
import {
  GetSocialEventQueryDTO,
  GetUserEventQueryDTO,
  GetUserParticipateEventQueryDTO,
  GetEventParticipantsQueryDTO,
  GetUserWishEventQueryDTO,
} from '../dto/request/query/participation.query.dto.js';
import {
  GetEventNodeResponseDTO,
  GetUserEventResponseDTO,
  GetUserParticipateEventResponseDTO,
  GetEventParticipantsResponseDTO,
  GetUserWishEventResponseDTO,
} from '../dto/response/social.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';
import { PaginatedIdsMapper } from '../mappers/paginated-ids.mapper.js';

@Controller()
export class ParticipationQueryController {
  private readonly logger = new Logger({
    context: ParticipationQueryController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_EVENT_NODE,
  )
  async getEventNode(
    data: GetSocialEventQueryDTO,
  ): Promise<GetEventNodeResponseDTO> {
    this.logger.log(
      `gRPC: Checking social event node existence: ${data.eventId}`,
    );
    const eventId = ParticipationMapper.toGetEventNodeParams(data);
    const exists = await this.service.getEventExists(eventId);
    return { exists };
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_USER_EVENT,
  )
  async getUserEvent(
    data: GetUserEventQueryDTO,
  ): Promise<GetUserEventResponseDTO> {
    this.logger.log(`gRPC: Getting events created by user: ${data.userId}`);
    const { userId, pagination } =
      ParticipationMapper.toGetUserEventsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserEvents(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_USER_PARTICIPATE_EVENT,
  )
  async getUserParticipateEvent(
    data: GetUserParticipateEventQueryDTO,
  ): Promise<GetUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: Getting events participated by user: ${data.userId}`,
    );
    const { userId, pagination } =
      ParticipationMapper.toGetUserParticipationsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserParticipations(
      userId,
      paginationVO,
    );
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_EVENT_PARTICIPANTS,
  )
  async getEventParticipants(
    data: GetEventParticipantsQueryDTO,
  ): Promise<GetEventParticipantsResponseDTO> {
    this.logger.log(`gRPC: Getting participants for event: ${data.eventId}`);
    const { eventId, pagination } =
      ParticipationMapper.toGetEventParticipantsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getEventParticipants(
      eventId,
      paginationVO,
    );
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE, 'getUserWishEvent')
  async getUserWishEvent(
    data: GetUserWishEventQueryDTO,
  ): Promise<GetUserWishEventResponseDTO> {
    this.logger.log(`gRPC: Getting wished events for user: ${data.userId}`);
    const { userId, pagination } =
      ParticipationMapper.toGetUserWishEventsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserWishes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
