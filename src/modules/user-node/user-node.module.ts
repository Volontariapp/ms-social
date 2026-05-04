import { Module } from '@nestjs/common';
import { SocialUserService, Neo4jSocialUserRepository } from '@volontariapp/domain-social';
import { UserNodeCommandController } from './controllers/user-node.command.controller.js';
import { UserNodeQueryController } from './controllers/user-node.query.controller.js';

@Module({
  controllers: [UserNodeCommandController, UserNodeQueryController],
  providers: [Neo4jSocialUserRepository, SocialUserService],
  exports: [SocialUserService],
})
export class UserNodeModule {}
