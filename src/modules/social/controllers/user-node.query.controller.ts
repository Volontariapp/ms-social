import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import { GRPC_SERVICES, SOCIAL_USER_NODE_METHODS } from '@volontariapp/contracts-nest';
import { SocialUserService } from '@volontariapp/domain-social';
import { GetSocialUserQueryDTO } from '../dto/request/query/user-node.query.dto.js';
import { GetUserNodeResponseDTO } from '../dto/response/social.response.dto.js';
import { UserNodeMapper } from '../mappers/user-node.mapper.js';

@Controller()
export class UserNodeQueryController {
  private readonly logger = new Logger({
    context: UserNodeQueryController.name,
  });

  constructor(private readonly service: SocialUserService) {}

  @GrpcMethod(GRPC_SERVICES.SOCIAL_USER_NODE_QUERY_SERVICE, SOCIAL_USER_NODE_METHODS.GET_USER_NODE)
  async getUserNode(data: GetSocialUserQueryDTO): Promise<GetUserNodeResponseDTO> {
    this.logger.log(`gRPC: Checking user node existence for: ${data.userId}`);
    const userId = UserNodeMapper.toUserIdVOFromQuery(data);
    const exists = await this.service.getUserExists(userId);
    return { exists };
  }
}
