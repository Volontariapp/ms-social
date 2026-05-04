import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, RELATIONSHIP_METHODS } from '@volontariapp/contracts-nest';
import { RelationshipService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
  AdminGetMyFollowsQueryDTO,
  AdminGetMyFollowersQueryDTO,
  AdminGetMyBlocksQueryDTO,
  AdminGetWhoBlockedMeQueryDTO,
} from '../dto/relationship.query.dto.js';
import {
  GetMyFollowsResponseDTO,
  GetMyFollowersResponseDTO,
  GetMyBlocksResponseDTO,
  GetWhoBlockedMeResponseDTO,
  AdminGetMyFollowsResponseDTO,
  AdminGetMyFollowersResponseDTO,
  AdminGetMyBlocksResponseDTO,
  AdminGetWhoBlockedMeResponseDTO,
} from '../dto/relationship.response.dto.js';
import { RelationshipMapper } from '../mappers/relationship.mapper.js';
import { PaginatedIdsMapper } from '../../../common/mappers/paginated-ids.mapper.js';

@Controller()
export class RelationshipQueryController {
  private readonly logger = new Logger({
    context: RelationshipQueryController.name,
  });

  constructor(private readonly service: RelationshipService) {}

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_FOLLOWS)
  async getMyFollows(
    @Payload() data: GetMyFollowsQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetMyFollowsResponseDTO> {
    this.logger.log(`gRPC: Getting follows for user: ${user.id}`);
    const { userId, pagination } = RelationshipMapper.toGetFollowsParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollows(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_FOLLOWERS)
  async getMyFollowers(
    @Payload() data: GetMyFollowersQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetMyFollowersResponseDTO> {
    this.logger.log(`gRPC: Getting followers for user: ${user.id}`);
    const { userId, pagination } = RelationshipMapper.toGetFollowersParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollowers(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_BLOCKS)
  async getMyBlocks(
    @Payload() data: GetMyBlocksQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetMyBlocksResponseDTO> {
    this.logger.log(`gRPC: Getting blocks for user: ${user.id}`);
    const { userId, pagination } = RelationshipMapper.toGetBlocksParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getBlocks(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_WHO_BLOCKED_ME)
  async getWhoBlockedMe(
    @Payload() data: GetWhoBlockedMeQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetWhoBlockedMeResponseDTO> {
    this.logger.log(`gRPC: Getting who blocked user: ${user.id}`);
    const { userId, pagination } = RelationshipMapper.toGetWhoBlockedMeParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getWhoBlockedMe(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.ADMIN_GET_MY_FOLLOWS)
  async adminGetMyFollows(
    @Payload() data: AdminGetMyFollowsQueryDTO,
  ): Promise<AdminGetMyFollowsResponseDTO> {
    this.logger.log(`gRPC: Admin getting follows for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toAdminGetFollowsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollows(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.ADMIN_GET_MY_FOLLOWERS)
  async adminGetMyFollowers(
    @Payload() data: AdminGetMyFollowersQueryDTO,
  ): Promise<AdminGetMyFollowersResponseDTO> {
    this.logger.log(`gRPC: Admin getting followers for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toAdminGetFollowersParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollowers(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.ADMIN_GET_MY_BLOCKS)
  async adminGetMyBlocks(
    @Payload() data: AdminGetMyBlocksQueryDTO,
  ): Promise<AdminGetMyBlocksResponseDTO> {
    this.logger.log(`gRPC: Admin getting blocks for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toAdminGetBlocksParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getBlocks(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE,
    RELATIONSHIP_METHODS.ADMIN_GET_WHO_BLOCKED_ME,
  )
  async adminGetWhoBlockedMe(
    @Payload() data: AdminGetWhoBlockedMeQueryDTO,
  ): Promise<AdminGetWhoBlockedMeResponseDTO> {
    this.logger.log(`gRPC: Admin getting who blocked user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toAdminGetWhoBlockedMeParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getWhoBlockedMe(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
