import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, RELATIONSHIP_METHODS } from '@volontariapp/contracts-nest';
import { RelationshipService } from '@volontariapp/domain-social';
import {
  PostFollowUserCommandDTO,
  DeleteFollowUserCommandDTO,
  PostBlockUserCommandDTO,
  DeleteBlockUserCommandDTO,
} from '../dto/request/command/relationship.command.dto.js';
import {
  PostFollowUserResponseDTO,
  DeleteFollowUserResponseDTO,
  PostBlockUserResponseDTO,
  DeleteBlockUserResponseDTO,
} from '../dto/response/social.response.dto.js';
import { RelationshipMapper } from '../mappers/relationship.mapper.js';

@Controller()
export class RelationshipCommandController {
  private readonly logger = new Logger({
    context: RelationshipCommandController.name,
  });

  constructor(private readonly service: RelationshipService) {}

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.POST_FOLLOW_USER)
  async postFollowUser(data: PostFollowUserCommandDTO): Promise<PostFollowUserResponseDTO> {
    this.logger.log(`gRPC: User ${data.followerId} following ${data.followedId}`);
    const { followerId, followedId } = RelationshipMapper.toFollowUserParams(data);
    await this.service.followUser(followerId, followedId);
    return new PostFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.DELETE_FOLLOW_USER)
  async deleteFollowUser(data: DeleteFollowUserCommandDTO): Promise<DeleteFollowUserResponseDTO> {
    this.logger.log(`gRPC: User ${data.followerId} unfollowing ${data.followedId}`);
    const { followerId, followedId } = RelationshipMapper.toUnfollowUserParams(data);
    await this.service.unfollowUser(followerId, followedId);
    return new DeleteFollowUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.POST_BLOCK_USER)
  async postBlockUser(data: PostBlockUserCommandDTO): Promise<PostBlockUserResponseDTO> {
    this.logger.log(`gRPC: User ${data.blockerId} blocking ${data.blockedId}`);
    const { blockerId, blockedId } = RelationshipMapper.toBlockUserParams(data);
    await this.service.blockUser(blockerId, blockedId);
    return new PostBlockUserResponseDTO();
  }

  @GrpcMethod(GRPC_SERVICES.RELATIONSHIP_COMMAND_SERVICE, RELATIONSHIP_METHODS.DELETE_BLOCK_USER)
  async deleteBlockUser(data: DeleteBlockUserCommandDTO): Promise<DeleteBlockUserResponseDTO> {
    this.logger.log(`gRPC: User ${data.blockerId} unblocking ${data.blockedId}`);
    const { blockerId, blockedId } = RelationshipMapper.toUnblockUserParams(data);
    await this.service.unblockUser(blockerId, blockedId);
    return new DeleteBlockUserResponseDTO();
  }
}
