import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, INTERACTION_METHODS } from '@volontariapp/contracts-nest';
import { InteractionService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
  AdminGetUserLikesQueryDTO,
} from '../dto/interaction.query.dto.js';
import {
  GetUserLikesResponseDTO,
  GetPostLikersResponseDTO,
  AdminGetUserLikesResponseDTO,
} from '../dto/interaction.response.dto.js';
import { InteractionMapper } from '../mappers/interaction.mapper.js';
import { PaginatedIdsMapper } from '../../../common/mappers/paginated-ids.mapper.js';

@Controller()
export class InteractionQueryController {
  private readonly logger = new Logger({
    context: InteractionQueryController.name,
  });

  constructor(private readonly service: InteractionService) {}

  @GrpcMethod(GRPC_SERVICES.INTERACTION_QUERY_SERVICE, INTERACTION_METHODS.GET_USER_LIKES)
  async getUserLikes(
    @Payload() data: GetUserLikesQueryDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<GetUserLikesResponseDTO> {
    this.logger.log(`gRPC: Getting likes for user: ${user.id}`);
    const { userId, pagination } = InteractionMapper.toGetUserLikesParams(data, user);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserLikes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.INTERACTION_QUERY_SERVICE, INTERACTION_METHODS.GET_POST_LIKERS)
  async getPostLikers(@Payload() data: GetPostLikersQueryDTO): Promise<GetPostLikersResponseDTO> {
    this.logger.log(`gRPC: Getting likers for post: ${data.postId}`);
    const { postId, pagination } = InteractionMapper.toGetPostLikersParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getPostLikers(postId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.INTERACTION_QUERY_SERVICE, INTERACTION_METHODS.ADMIN_GET_USER_LIKES)
  async adminGetUserLikes(
    @Payload() data: AdminGetUserLikesQueryDTO,
  ): Promise<AdminGetUserLikesResponseDTO> {
    this.logger.log(`gRPC: Admin getting likes for user: ${data.userId}`);
    const { userId, pagination } = InteractionMapper.toAdminGetUserLikesParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserLikes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
