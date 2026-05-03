import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, INTERACTION_METHODS } from '@volontariapp/contracts-nest';
import { InteractionService } from '@volontariapp/domain-social';
import {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
  AdminPostLikePostCommandDTO,
  AdminDeleteLikePostCommandDTO,
} from '../dto/interaction.command.dto.js';
import {
  PostLikePostResponseDTO,
  DeleteLikePostResponseDTO,
  AdminPostLikePostResponseDTO,
  AdminDeleteLikePostResponseDTO,
} from '../dto/interaction.response.dto.js';
import { InteractionMapper } from '../mappers/interaction.mapper.js';

@Controller()
export class InteractionCommandController {
  private readonly logger = new Logger({
    context: InteractionCommandController.name,
  });

  constructor(private readonly service: InteractionService) {}

  @GrpcMethod(GRPC_SERVICES.INTERACTION_COMMAND_SERVICE, INTERACTION_METHODS.POST_LIKE_POST)
  async postLikePost(
    data: PostLikePostCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostLikePostResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} liking post ${data.postId}`);
    const { userId, postId } = InteractionMapper.toLikePostParams(data, user);
    await this.service.likePost(userId, postId);
    return new PostLikePostResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.INTERACTION_COMMAND_SERVICE, INTERACTION_METHODS.DELETE_LIKE_POST)
  async deleteLikePost(
    data: DeleteLikePostCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteLikePostResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} unliking post ${data.postId}`);
    const { userId, postId } = InteractionMapper.toUnlikePostParams(data, user);
    await this.service.unlikePost(userId, postId);
    return new DeleteLikePostResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.INTERACTION_COMMAND_SERVICE, 'adminPostLikePost')
  async adminPostLikePost(
    data: AdminPostLikePostCommandDTO,
  ): Promise<AdminPostLikePostResponseDTO> {
    this.logger.log(`gRPC: Admin user liking post ${data.postId} for user ${data.userId}`);
    const { userId, postId } = InteractionMapper.toAdminLikePostParams(data);
    await this.service.likePost(userId, postId);
    return new AdminPostLikePostResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.INTERACTION_COMMAND_SERVICE, 'adminDeleteLikePost')
  async adminDeleteLikePost(
    data: AdminDeleteLikePostCommandDTO,
  ): Promise<AdminDeleteLikePostResponseDTO> {
    this.logger.log(`gRPC: Admin user unliking post ${data.postId} for user ${data.userId}`);
    const { userId, postId } = InteractionMapper.toAdminUnlikePostParams(data);
    await this.service.unlikePost(userId, postId);
    return new AdminDeleteLikePostResponseDTO();
  }
}
