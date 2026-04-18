import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  INTERACTION_METHODS,
} from '@volontariapp/contracts-nest';
import { InteractionService } from '@volontariapp/domain-social';
import {
  PostLikePostCommandDTO,
  DeleteLikePostCommandDTO,
} from '../dto/request/command/interaction.command.dto.js';
import {
  PostLikePostResponseDTO,
  DeleteLikePostResponseDTO,
} from '../dto/response/social.response.dto.js';
import { InteractionMapper } from '../mappers/interaction.mapper.js';

@Controller()
export class InteractionCommandController {
  private readonly logger = new Logger({
    context: InteractionCommandController.name,
  });

  constructor(private readonly service: InteractionService) {}

  @GrpcMethod(
    GRPC_SERVICES.INTERACTION_COMMAND_SERVICE,
    INTERACTION_METHODS.POST_LIKE_POST,
  )
  async postLikePost(
    data: PostLikePostCommandDTO,
  ): Promise<PostLikePostResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} liking post ${data.postId}`);
    const { userId, postId } = InteractionMapper.toLikePostParams(data);
    await this.service.likePost(userId, postId);
    return new PostLikePostResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.INTERACTION_COMMAND_SERVICE,
    INTERACTION_METHODS.DELETE_LIKE_POST,
  )
  async deleteLikePost(
    data: DeleteLikePostCommandDTO,
  ): Promise<DeleteLikePostResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} unliking post ${data.postId}`);
    const { userId, postId } = InteractionMapper.toUnlikePostParams(data);
    await this.service.unlikePost(userId, postId);
    return new DeleteLikePostResponseDTO();
  }
}
