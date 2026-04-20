import { UserId } from '@volontariapp/domain-social';
import type { CreateSocialUserCommandDTO } from '../dto/request/command/user-node.command.dto.js';
import type { GetSocialUserQueryDTO } from '../dto/request/query/user-node.query.dto.js';

export class UserNodeMapper {
  static toUserIdVO(userId: string): UserId {
    return new UserId(userId);
  }

  static toUserIdVOFromCommand(dto: CreateSocialUserCommandDTO): UserId {
    return this.toUserIdVO(dto.userId);
  }

  static toUserIdVOFromQuery(dto: GetSocialUserQueryDTO): UserId {
    return this.toUserIdVO(dto.userId);
  }
}
