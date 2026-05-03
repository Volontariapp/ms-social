import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { CurrentUser } from '@volontariapp/auth';
import type { AuthUser } from '@volontariapp/auth';
import { GRPC_SERVICES, RELATIONSHIP_METHODS } from '@volontariapp/contracts-nest';
import { RelationshipService } from '@volontariapp/domain-social';
import {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
  AdminPostFollowUserCommandDTO,
  AdminDeleteFollowUserCommandDTO,
  AdminPostBlockUserCommandDTO,
  AdminDeleteBlockUserCommandDTO,
} from '../dto/request/command/relationship.command.dto.js';
import {
  PostFollowUserResponseDTO,
  DeleteFollowUserResponseDTO,
  PostBlockUserResponseDTO,
  DeleteBlockUserResponseDTO,
  AdminPostFollowUserResponseDTO,
  AdminDeleteFollowUserResponseDTO,
  AdminPostBlockUserResponseDTO,
  AdminDeleteBlockUserResponseDTO,
} from '../dto/response/social.response.dto.js';
import { RelationshipMapper } from '../mappers/relationship.mapper.js';

@Controller()
export class RelationshipCommandController {
  private readonly logger = new Logger({
    context: RelationshipCommandController.name,
  });

  constructor(private readonly service: RelationshipService) {}

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.POST_FOLLOW_USER)
  async postFollowUser(
    data: PostFollowUserCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostFollowUserResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} following ${data.followedId}`);
    const { followerId, followedId } = RelationshipMapper.toFollowUserParams(data, user);
    await this.service.followUser(followerId, followedId);
    return new PostFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.DELETE_FOLLOW_USER)
  async deleteFollowUser(
    data: DeleteFollowUserCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteFollowUserResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} unfollowing ${data.followedId}`);
    const { followerId, followedId } = RelationshipMapper.toUnfollowUserParams(data, user);
    await this.service.unfollowUser(followerId, followedId);
    return new DeleteFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.POST_BLOCK_USER)
  async postBlockUser(
    data: PostBlockUserCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<PostBlockUserResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} blocking ${data.blockedId}`);
    const { blockerId, blockedId } = RelationshipMapper.toBlockUserParams(data, user);
    await this.service.blockUser(blockerId, blockedId);
    return new PostBlockUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.DELETE_BLOCK_USER)
  async deleteBlockUser(
    data: DeleteBlockUserCommandDTO,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteBlockUserResponseDTO> {
    this.logger.log(`gRPC: User ${user.id} unblocking ${data.blockedId}`);
    const { blockerId, blockedId } = RelationshipMapper.toUnblockUserParams(data, user);
    await this.service.unblockUser(blockerId, blockedId);
    return new DeleteBlockUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, 'adminPostFollowUser')
  async adminPostFollowUser(
    data: AdminPostFollowUserCommandDTO,
  ): Promise<AdminPostFollowUserResponseDTO> {
    this.logger.log(`gRPC: Admin user following ${data.followedId} for user ${data.followerId}`);
    const { followerId, followedId } = RelationshipMapper.toAdminFollowUserParams(data);
    await this.service.followUser(followerId, followedId);
    return new AdminPostFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, 'adminDeleteFollowUser')
  async adminDeleteFollowUser(
    data: AdminDeleteFollowUserCommandDTO,
  ): Promise<AdminDeleteFollowUserResponseDTO> {
    this.logger.log(`gRPC: Admin user unfollowing ${data.followedId} for user ${data.followerId}`);
    const { followerId, followedId } = RelationshipMapper.toAdminUnfollowUserParams(data);
    await this.service.unfollowUser(followerId, followedId);
    return new AdminDeleteFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, 'adminPostBlockUser')
  async adminPostBlockUser(
    data: AdminPostBlockUserCommandDTO,
  ): Promise<AdminPostBlockUserResponseDTO> {
    this.logger.log(`gRPC: Admin user blocking ${data.blockedId} for user ${data.blockerId}`);
    const { blockerId, blockedId } = RelationshipMapper.toAdminBlockUserParams(data);
    await this.service.blockUser(blockerId, blockedId);
    return new AdminPostBlockUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, 'adminDeleteBlockUser')
  async adminDeleteBlockUser(
    data: AdminDeleteBlockUserCommandDTO,
  ): Promise<AdminDeleteBlockUserResponseDTO> {
    this.logger.log(`gRPC: Admin user unblocking ${data.blockedId} for user ${data.blockerId}`);
    const { blockerId, blockedId } = RelationshipMapper.toAdminUnblockUserParams(data);
    await this.service.unblockUser(blockerId, blockedId);
    return new AdminDeleteBlockUserResponseDTO();
  }
}
