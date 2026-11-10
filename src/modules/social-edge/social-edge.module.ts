import { Module } from '@nestjs/common';
import {
  Neo4jParticipationRepository,
  PostgresSocialEdgeRepository,
  SocialEdgeIntentService,
  parseSocialWriteMode,
} from '@volontariapp/domain-social';
import { AppConfigService } from '../../config/app-config.service.js';
import { SocialEdgeMirrorService } from './social-edge-mirror.service.js';
import { SOCIAL_WRITE_MODE } from './social-edge.constants.js';

@Module({
  providers: [
    Neo4jParticipationRepository,
    PostgresSocialEdgeRepository,
    SocialEdgeIntentService,
    {
      provide: SOCIAL_WRITE_MODE,
      useFactory: (config: AppConfigService) => parseSocialWriteMode(config.socialWriteMode),
      inject: [AppConfigService],
    },
    SocialEdgeMirrorService,
  ],
  exports: [SocialEdgeMirrorService],
})
export class SocialEdgeModule {}
