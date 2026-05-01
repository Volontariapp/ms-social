import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, RELATIONSHIP_METHODS } from '@volontariapp/contracts-nest';
import { RelationshipService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetMyFollowsQueryDTO,
  GetMyFollowersQueryDTO,
  GetMyBlocksQueryDTO,
  GetWhoBlockedMeQueryDTO,
} from '../dto/request/query/relationship.query.dto.js';
import {
  GetMyFollowsResponseDTO,
  GetMyFollowersResponseDTO,
  GetMyBlocksResponseDTO,
  GetWhoBlockedMeResponseDTO,
} from '../dto/response/social.response.dto.js';
import { RelationshipMapper } from '../mappers/relationship.mapper.js';
import { PaginatedIdsMapper } from '../mappers/paginated-ids.mapper.js';

@Controller()
export class RelationshipQueryController {
  private readonly logger = new Logger({
    context: RelationshipQueryController.name,
  });

  constructor(private readonly service: RelationshipService) {}

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_FOLLOWS)
  async getMyFollows(data: GetMyFollowsQueryDTO): Promise<GetMyFollowsResponseDTO> {
    this.logger.log(`gRPC: Getting follows for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toGetFollowsParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollows(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_FOLLOWERS)
  async getMyFollowers(data: GetMyFollowersQueryDTO): Promise<GetMyFollowersResponseDTO> {
    this.logger.log(`gRPC: Getting followers for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toGetFollowersParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFollowers(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_MY_BLOCKS)
  async getMyBlocks(data: GetMyBlocksQueryDTO): Promise<GetMyBlocksResponseDTO> {
    this.logger.log(`gRPC: Getting blocks for user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toGetBlocksParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getBlocks(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_QUERY_SERVICE, RELATIONSHIP_METHODS.GET_WHO_BLOCKED_ME)
  async getWhoBlockedMe(data: GetWhoBlockedMeQueryDTO): Promise<GetWhoBlockedMeResponseDTO> {
    this.logger.log(`gRPC: Getting who blocked user: ${data.userId}`);
    const { userId, pagination } = RelationshipMapper.toGetWhoBlockedMeParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getWhoBlockedMe(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
