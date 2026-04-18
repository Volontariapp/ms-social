import { DynamicModule, Global, Module } from '@nestjs/common';
import { Neo4jBridgeModule } from '@volontariapp/bridge-nest';
import type { CustomConfig } from '../../config/base-config.js';

@Global()
@Module({})
export class DatabaseModule {
  static register(config: CustomConfig): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        Neo4jBridgeModule.register({
          url: config.neo4j.url,
          authToken: config.neo4j.authToken,
        }),
      ],
      exports: [Neo4jBridgeModule],
      global: true,
    };
  }
}
