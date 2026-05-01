import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, PUBLICATION_METHODS } from '@volontariapp/contracts-nest';
import { PublicationService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetSocialPostQueryDTO,
  GetUserPostsQueryDTO,
  GetFeedQueryDTO,
} from '../dto/request/query/publication.query.dto.js';
import {
  GetPostNodeResponseDTO,
  GetUserPostsResponseDTO,
  GetFeedResponseDTO,
} from '../dto/response/social.response.dto.js';
import { PublicationMapper } from '../mappers/publication.mapper.js';
import { PaginatedIdsMapper } from '../mappers/paginated-ids.mapper.js';

@Controller()
export class PublicationQueryController {
  private readonly logger = new Logger({
    context: PublicationQueryController.name,
  });

  constructor(private readonly service: PublicationService) {}

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_QUERY_SERVICE, PUBLICATION_METHODS.GET_POST_NODE)
  async getPostNode(data: GetSocialPostQueryDTO): Promise<GetPostNodeResponseDTO> {
    this.logger.log(`gRPC: Checking post node existence for: ${data.postId}`);
    const postId = PublicationMapper.toGetPostQueryParams(data);
    const exists = await this.service.getPostExists(postId);
    return { exists };
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_QUERY_SERVICE, PUBLICATION_METHODS.GET_USER_POSTS)
  async getUserPosts(data: GetUserPostsQueryDTO): Promise<GetUserPostsResponseDTO> {
    this.logger.log(`gRPC: Getting posts for user: ${data.userId}`);
    const { userId, pagination } = PublicationMapper.toGetUserPostsQueryParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserPosts(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_QUERY_SERVICE, PUBLICATION_METHODS.GET_FEED)
  async getFeed(data: GetFeedQueryDTO): Promise<GetFeedResponseDTO> {
    this.logger.log(`gRPC: Getting feed for user: ${data.userId}`);
    const { userId, pagination } = PublicationMapper.toGetFeedQueryParams(data);
    const paginationVO = pagination ?? new PaginationVO(1, 10);
    const paginatedIds = await this.service.getFeed(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
