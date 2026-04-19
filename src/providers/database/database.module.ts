import { DynamicModule, Global, Module } from '@nestjs/common';
import { Neo4jBridgeModule } from '@volontariapp/bridge-nest';
import type { CustomConfig } from '../../config/base-config.js';

@Global()
@Module({})
export class DatabaseModule {
  static register(config: CustomConfig): DynamicModule {
    const neo4jModule = Neo4jBridgeModule.register({
      url: config.neo4j.url,
      authToken: config.neo4j.authToken,
    });

    return {
      module: DatabaseModule,
      imports: [neo4jModule],
      exports: [Neo4jBridgeModule],
    };
  }
}
