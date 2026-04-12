import { Module } from '@nestjs/common';
import { SocialCommandController } from './controllers/social.command.controller.js';
import { SocialQueryController } from './controllers/social.query.controller.js';

@Module({
  controllers: [SocialCommandController, SocialQueryController],
})
export class SocialModule {}
