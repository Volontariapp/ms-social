import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  INTERACTION_METHODS,
} from '@volontariapp/contracts-nest';
import { InteractionService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetUserLikesQueryDTO,
  GetPostLikersQueryDTO,
} from '../dto/request/query/interaction.query.dto.js';
import {
  GetUserLikesResponseDTO,
  GetPostLikersResponseDTO,
} from '../dto/response/social.response.dto.js';
import { InteractionMapper } from '../mappers/interaction.mapper.js';
import { PaginatedIdsMapper } from '../mappers/paginated-ids.mapper.js';

@Controller()
export class InteractionQueryController {
  private readonly logger = new Logger({
    context: InteractionQueryController.name,
  });

  constructor(private readonly service: InteractionService) {}

  @GrpcMethod(
    GRPC_SERVICES.INTERACTION_QUERY_SERVICE,
    INTERACTION_METHODS.GET_USER_LIKES,
  )
  async getUserLikes(
    data: GetUserLikesQueryDTO,
  ): Promise<GetUserLikesResponseDTO> {
    this.logger.log(`gRPC: Getting likes for user: ${data.userId}`);
    const { userId, pagination } = InteractionMapper.toGetUserLikesParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserLikes(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.INTERACTION_QUERY_SERVICE,
    INTERACTION_METHODS.GET_POST_LIKERS,
  )
  async getPostLikers(
    data: GetPostLikersQueryDTO,
  ): Promise<GetPostLikersResponseDTO> {
    this.logger.log(`gRPC: Getting likers for post: ${data.postId}`);
    const { postId, pagination } =
      InteractionMapper.toGetPostLikersParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getPostLikers(postId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
