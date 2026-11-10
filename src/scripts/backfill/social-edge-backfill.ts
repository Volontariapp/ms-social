import { SocialEdgeKind } from '@volontariapp/messaging';

export interface BackfillEdgeRow {
  fromId: string;
  toId: string;
  /** ISO date of the relation when Neo4j knows it (PARTICIPATE.registeredAt), otherwise null. */
  createdAt: string | null;
}

export interface SocialEdgeSource {
  readBatch(kind: SocialEdgeKind, skip: number, limit: number): Promise<BackfillEdgeRow[]>;
}

export interface SocialEdgeSink {
  /** Number of rows of the batch that are not yet in `social_edge`. Writes nothing. */
  countMissing(kind: SocialEdgeKind, rows: BackfillEdgeRow[]): Promise<number>;
  /** INSERT ... ON CONFLICT DO NOTHING. Returns the number of rows really inserted. */
  insertMissing(kind: SocialEdgeKind, rows: BackfillEdgeRow[]): Promise<number>;
}

export interface BackfillOptions {
  /** When true nothing is written: the report says how many rows would be inserted. */
  dryRun: boolean;
  batchSize: number;
  kinds?: SocialEdgeKind[];
}

export interface BackfillKindReport {
  kind: SocialEdgeKind;
  read: number;
  skippedInvalidId: number;
  missing: number;
  inserted: number;
}

export interface BackfillReport {
  dryRun: boolean;
  kinds: BackfillKindReport[];
}

export const ALL_SOCIAL_EDGE_KINDS: SocialEdgeKind[] = [
  SocialEdgeKind.LIKE,
  SocialEdgeKind.FOLLOW,
  SocialEdgeKind.WISH,
  SocialEdgeKind.PARTICIPATE,
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string): boolean => UUID_PATTERN.test(value);

/**
 * Copies the relations that exist in Neo4j into `social_edge`. Idempotent (the sink ignores rows
 * already present), batched, and read-only on Neo4j. In dry-run mode the sink is only asked to
 * count, never to write.
 */
export async function runSocialEdgeBackfill(
  source: SocialEdgeSource,
  sink: SocialEdgeSink,
  options: BackfillOptions,
): Promise<BackfillReport> {
  if (!Number.isInteger(options.batchSize) || options.batchSize <= 0) {
    throw new Error(`batchSize must be a positive integer, got ${String(options.batchSize)}`);
  }
  const kinds = options.kinds ?? ALL_SOCIAL_EDGE_KINDS;
  const reports: BackfillKindReport[] = [];

  for (const kind of kinds) {
    const report: BackfillKindReport = {
      kind,
      read: 0,
      skippedInvalidId: 0,
      missing: 0,
      inserted: 0,
    };
    let skip = 0;
    for (;;) {
      const batch = await source.readBatch(kind, skip, options.batchSize);
      if (batch.length === 0) break;
      skip += batch.length;
      report.read += batch.length;

      const valid = batch.filter((row) => isUuid(row.fromId) && isUuid(row.toId));
      report.skippedInvalidId += batch.length - valid.length;

      if (valid.length > 0) {
        if (options.dryRun) {
          report.missing += await sink.countMissing(kind, valid);
        } else {
          const inserted = await sink.insertMissing(kind, valid);
          report.inserted += inserted;
          report.missing += inserted;
        }
      }
      if (batch.length < options.batchSize) break;
    }
    reports.push(report);
  }

  return { dryRun: options.dryRun, kinds: reports };
}
