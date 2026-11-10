import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * L9 (ms-social, "Postgres first"), phase 1: the table that holds the wanted state of every
 * LIKE, FOLLOW, WISH and PARTICIPATE relation. In `sync` mode it mirrors Neo4j (double write);
 * the `async` mode will make it the source of truth for the answer of the write RPCs.
 *
 * Expand only: a new table, nothing existing is touched. See docs/optimisation-ecritures/06.
 */
export class CreateSocialEdge1794340000000 implements MigrationInterface {
  name = 'CreateSocialEdge1794340000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "social_edge" (
        "kind" text NOT NULL,
        "from_id" uuid NOT NULL,
        "to_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_social_edge" PRIMARY KEY ("kind", "from_id", "to_id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "social_edge_to_idx" ON "social_edge" ("kind", "to_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "social_edge_to_idx"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "social_edge"`);
  }
}
