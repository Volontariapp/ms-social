import 'reflect-metadata';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import neo4j from 'neo4j-driver';
import { DataSource } from 'typeorm';
import { loadConfig } from '@volontariapp/config';
import type { SocialEdgeKind } from '@volontariapp/messaging';
import { CustomConfig } from '../config/base-config.js';
import { ALL_SOCIAL_EDGE_KINDS, runSocialEdgeBackfill } from './backfill/social-edge-backfill.js';
import {
  Neo4jSocialEdgeSource,
  PostgresSocialEdgeSink,
} from './backfill/social-edge-backfill.adapters.js';

/**
 * Usage:
 *   node dist/scripts/backfill-social-edge.js                 dry run (default): counts, writes nothing
 *   node dist/scripts/backfill-social-edge.js --apply         really inserts into social_edge
 *   options: --batch-size=<n> (default 1000), --kinds=LIKE,FOLLOW,WISH,PARTICIPATE
 */
const DEFAULT_BATCH_SIZE = 1000;

function resolveConfigDirectory(): string {
  const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'config');
  if (existsSync(dir)) return dir;
  throw new Error(`Config directory not found: ${dir}`);
}

function readOption(args: string[], name: string): string | undefined {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

function parseKinds(value: string | undefined): SocialEdgeKind[] {
  if (!value) return ALL_SOCIAL_EDGE_KINDS;
  return value.split(',').map((raw) => {
    const kind = ALL_SOCIAL_EDGE_KINDS.find(
      (candidate) => String(candidate) === raw.trim().toUpperCase(),
    );
    if (!kind) throw new Error(`Unknown kind: ${raw}`);
    return kind;
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  if (apply && args.includes('--dry-run')) {
    throw new Error('--apply and --dry-run are exclusive');
  }
  const batchSize = Number(readOption(args, 'batch-size') ?? DEFAULT_BATCH_SIZE);
  const kinds = parseKinds(readOption(args, 'kinds'));

  const config = loadConfig(resolveConfigDirectory(), CustomConfig);
  const { authToken } = config.neo4j;
  const driver = neo4j.driver(config.neo4j.url, {
    scheme: authToken.scheme ?? 'basic',
    principal: authToken.principal,
    credentials: authToken.credentials,
    ...(authToken.realm ? { realm: authToken.realm } : {}),
  });
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    ssl: config.db.ssl ? { rejectUnauthorized: false } : false,
    synchronize: false,
  });

  await dataSource.initialize();
  try {
    console.log(
      `social_edge backfill: ${apply ? 'APPLY' : 'DRY RUN (nothing is written)'}, batch ${String(batchSize)}, kinds ${kinds.join(',')}`,
    );
    const report = await runSocialEdgeBackfill(
      new Neo4jSocialEdgeSource(driver, config.neo4j.database),
      new PostgresSocialEdgeSink(dataSource),
      { dryRun: !apply, batchSize, kinds },
    );
    console.table(report.kinds);
  } finally {
    await dataSource.destroy();
    await driver.close();
  }
}

main().catch((error: unknown) => {
  console.error('social_edge backfill failed', error);
  process.exitCode = 1;
});
