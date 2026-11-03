import { Inject, Injectable, type OnApplicationBootstrap } from '@nestjs/common';
import { NestNeo4jProvider, NEST_NEO4J_PROVIDER } from '@volontariapp/bridge-nest';
import { Logger } from '@volontariapp/logger';

export const NEO4J_UNIQUE_CONSTRAINTS: readonly string[] = [
  'CREATE CONSTRAINT social_user_user_id IF NOT EXISTS FOR (n:SocialUser) REQUIRE n.userId IS UNIQUE',
  'CREATE CONSTRAINT social_post_post_id IF NOT EXISTS FOR (n:SocialPost) REQUIRE n.postId IS UNIQUE',
  'CREATE CONSTRAINT social_event_event_id IF NOT EXISTS FOR (n:SocialEvent) REQUIRE n.eventId IS UNIQUE',
] as const;

@Injectable()
export class Neo4jSchemaInitializer implements OnApplicationBootstrap {
  private readonly logger = new Logger({
    context: Neo4jSchemaInitializer.name,
  });

  constructor(
    @Inject(NEST_NEO4J_PROVIDER)
    private readonly neo4jProvider: NestNeo4jProvider,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!this.neo4jProvider.isConnected()) {
      this.logger.warn('Neo4j is not connected, unique constraints were not created');
      return;
    }

    const session = this.neo4jProvider.getDriver().session();
    try {
      for (const constraint of NEO4J_UNIQUE_CONSTRAINTS) {
        try {
          await session.run(constraint);
        } catch (error: unknown) {
          this.logger.error(`Failed to create Neo4j constraint: ${constraint}`, error);
        }
      }
    } finally {
      await session.close();
    }
  }
}
