import { DynamicModule, Module } from '@nestjs/common';
import { HealthModule } from '@volontariapp/health-check-nest';
import { AppConfigModule } from './config/app-config.module.js';
import type { CustomConfig } from './config/base-config.js';
import { DatabaseModule } from './providers/database/database.module.js';
import { SocialModule } from './modules/social/social.module.js';
import { GrpcClientModule } from './grpc/grpc-client.module.js';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalExceptionFilter } from '@volontariapp/errors-nest';
import { GrpcValidationPipe } from '@volontariapp/validation-nest';

@Module({
  imports: [],
})
export class AppModule {
  static register(config: CustomConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        AppConfigModule.forRoot(config),
        DatabaseModule.register(config),
        SocialModule,
        GrpcClientModule,
        HealthModule.register({
          databases: ['neo4j'],
          failOnMissingProvider: true,
        }),
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: GlobalExceptionFilter,
        },
        {
          provide: APP_PIPE,
          useFactory: (): GrpcValidationPipe =>
            new GrpcValidationPipe({
              enumMaps: {},
            }),
        },
      ],
    };
  }
}
