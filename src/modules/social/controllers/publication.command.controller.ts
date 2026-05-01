import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, PUBLICATION_METHODS } from '@volontariapp/contracts-nest';
import { PublicationService } from '@volontariapp/domain-social';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
} from '../dto/request/command/publication.command.dto.js';
import {
  CreatePostNodeResponseDTO,
  DeletePostNodeResponseDTO,
  PostUserOwnResponseDTO,
  DeleteUserOwnResponseDTO,
} from '../dto/response/social.response.dto.js';
import { PublicationMapper } from '../mappers/publication.mapper.js';

@Controller()
export class PublicationCommandController {
  private readonly logger = new Logger({
    context: PublicationCommandController.name,
  });

  constructor(private readonly service: PublicationService) {}

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.CREATE_POST_NODE)
  async createPostNode(data: CreateSocialPostCommandDTO): Promise<CreatePostNodeResponseDTO> {
    this.logger.log(`gRPC: Creating post node for: ${data.postId}`);
    const postId = PublicationMapper.toPostIdVOFromCommand(data);
    await this.service.createPost(postId);
    return new CreatePostNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.DELETE_POST_NODE)
  async deletePostNode(data: DeleteSocialPostCommandDTO): Promise<DeletePostNodeResponseDTO> {
    this.logger.log(`gRPC: Deleting post node for: ${data.postId}`);
    const postId = PublicationMapper.toDeletePostIdVOFromCommand(data);
    await this.service.deletePost(postId);
    return new DeletePostNodeResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.POST_USER_OWN)
  async postUserOwn(data: PostUserOwnCommandDTO): Promise<PostUserOwnResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} owns post ${data.postId}`);
    const { userId, postId } = PublicationMapper.toOwnPostCommandParams(data);
    await this.service.ownPost(userId, postId);
    return new PostUserOwnResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.DELETE_USER_OWN)
  async deleteUserOwn(data: DeleteUserOwnCommandDTO): Promise<DeleteUserOwnResponseDTO> {
    this.logger.log(`gRPC: User ${data.userId} disowns post ${data.postId}`);
    const { userId, postId } = PublicationMapper.toDisownPostCommandParams(data);
    await this.service.disownPost(userId, postId);
    return new DeleteUserOwnResponseDTO();
  }
}
