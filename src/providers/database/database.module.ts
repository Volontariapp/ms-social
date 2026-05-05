import { DynamicModule, Global, Module } from '@nestjs/common';
import { Neo4jBridgeModule, PostgresBridgeModule } from '@volontariapp/bridge-nest';
import type { CustomConfig } from '../../config/base-config.js';
import { JobsOutboxModel, EventQueueModel } from '@volontariapp/database';
import { TypeOrmModule } from '@nestjs/typeorm';

const entities = [JobsOutboxModel, EventQueueModel];

@Global()
@Module({})
export class DatabaseModule {
  static register(config: CustomConfig): DynamicModule {
    const neo4jModule = Neo4jBridgeModule.register({
      url: config.neo4j.url,
      authToken: config.neo4j.authToken,
    });
    const postgresModule = PostgresBridgeModule.register({
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
      entities,
      synchronize: false,
    });
    const typeOrmModule = TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
      entities,
      synchronize: false,
    });
    const typeOrmFeature = TypeOrmModule.forFeature(entities);

    return {
      module: DatabaseModule,
      imports: [neo4jModule, postgresModule, typeOrmModule, typeOrmFeature],
      exports: [Neo4jBridgeModule, PostgresBridgeModule, TypeOrmModule],
    };
  }
}
