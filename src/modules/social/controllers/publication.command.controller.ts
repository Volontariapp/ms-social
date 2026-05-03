import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, PUBLICATION_METHODS } from '@volontariapp/contracts-nest';
import { PublicationService } from '@volontariapp/domain-social';
import {
  CreateSocialPostCommandDTO,
  DeleteSocialPostCommandDTO,
  PostUserOwnCommandDTO,
  DeleteUserOwnCommandDTO,
  AdminPostUserOwnCommandDTO,
  AdminDeleteUserOwnCommandDTO,
} from '../dto/request/command/publication.command.dto.js';
import {
  CreatePostNodeResponseDTO,
  DeletePostNodeResponseDTO,
  PostUserOwnResponseDTO,
  DeleteUserOwnResponseDTO,
  AdminPostUserOwnResponseDTO,
  AdminDeleteUserOwnResponseDTO,
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
  async postUserOwn(
    data: PostUserOwnCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostUserOwnResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} owns post ${data.postId}`);
    const { userId, postId } = PublicationMapper.toOwnPostCommandParams(data, user);
    await this.service.ownPost(userId, postId);
    return new PostUserOwnResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.DELETE_USER_OWN)
  async deleteUserOwn(
    data: DeleteUserOwnCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteUserOwnResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} disowns post ${data.postId}`);
    const { userId, postId } = PublicationMapper.toDisownPostCommandParams(data, user);
    await this.service.disownPost(userId, postId);
    return new DeleteUserOwnResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, 'adminPostUserOwn')
  async adminPostUserOwn(data: AdminPostUserOwnCommandDTO): Promise<AdminPostUserOwnResponseDTO> {
    this.logger.log(`gRPC: Admin user owns post ${data.postId} for user ${data.userId}`);
    const { userId, postId } = PublicationMapper.toAdminOwnPostCommandParams(data);
    await this.service.ownPost(userId, postId);
    return new AdminPostUserOwnResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, 'adminDeleteUserOwn')
  async adminDeleteUserOwn(
    data: AdminDeleteUserOwnCommandDTO,
  ): Promise<AdminDeleteUserOwnResponseDTO> {
    this.logger.log(`gRPC: Admin user disowns post ${data.postId} for user ${data.userId}`);
    const { userId, postId } = PublicationMapper.toAdminDisownPostCommandParams(data);
    await this.service.disownPost(userId, postId);
    return new AdminDeleteUserOwnResponseDTO();
  }
}
