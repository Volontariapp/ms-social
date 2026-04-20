import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  SOCIAL_USER_NODE_METHODS,
} from '@volontariapp/contracts-nest';
import { SocialUserService } from '@volontariapp/domain-social';
import {
  CreateSocialUserCommandDTO,
  DeleteSocialUserCommandDTO,
} from '../dto/request/command/user-node.command.dto.js';
import {
  CreateUserNodeResponseDTO,
  DeleteUserNodeResponseDTO,
} from '../dto/response/social.response.dto.js';
import { UserNodeMapper } from '../mappers/user-node.mapper.js';

@Controller()
export class UserNodeCommandController {
  private readonly logger = new Logger({
    context: UserNodeCommandController.name,
  });

  constructor(private readonly service: SocialUserService) {}

  @GrpcMethod(
    GRPC_SERVICES.SOCIAL_USER_NODE_COMMAND_SERVICE,
    SOCIAL_USER_NODE_METHODS.CREATE_USER_NODE,
  )
  async createUserNode(
    data: CreateSocialUserCommandDTO,
  ): Promise<CreateUserNodeResponseDTO> {
    this.logger.log(`gRPC: Creating user node for: ${data.userId}`);
    const userId = UserNodeMapper.toUserIdVOFromCommand(data);
    await this.service.createUser(userId);
    return new CreateUserNodeResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.SOCIAL_USER_NODE_COMMAND_SERVICE,
    SOCIAL_USER_NODE_METHODS.DELETE_USER_NODE,
  )
  async deleteUserNode(
    data: DeleteSocialUserCommandDTO,
  ): Promise<DeleteUserNodeResponseDTO> {
    this.logger.log(`gRPC: Deleting user node for: ${data.userId}`);
    const userId = UserNodeMapper.toUserIdVO(data.userId);
    await this.service.deleteUser(userId);
    return new DeleteUserNodeResponseDTO();
  }
}
