import type { DataSource } from 'typeorm';
import neo4j from 'neo4j-driver';
import type { Driver } from 'neo4j-driver';
import { SocialEdgeKind } from '@volontariapp/messaging';
import type { BackfillEdgeRow, SocialEdgeSink, SocialEdgeSource } from './social-edge-backfill.js';

interface EdgeShape {
  relationship: string;
  targetLabel: string;
  targetKey: string;
  createdAtExpression: string;
}

/** Same shapes as the Neo4j writes of domain-social (WISH is stored as WISH_TO_PARTICIPATE). */
const EDGE_SHAPES: Record<SocialEdgeKind, EdgeShape> = {
  [SocialEdgeKind.LIKE]: {
    relationship: 'LIKE',
    targetLabel: 'SocialPost',
    targetKey: 'postId',
    createdAtExpression: 'null',
  },
  [SocialEdgeKind.FOLLOW]: {
    relationship: 'FOLLOW',
    targetLabel: 'SocialUser',
    targetKey: 'userId',
    createdAtExpression: 'null',
  },
  [SocialEdgeKind.WISH]: {
    relationship: 'WISH_TO_PARTICIPATE',
    targetLabel: 'SocialEvent',
    targetKey: 'eventId',
    createdAtExpression: 'null',
  },
  [SocialEdgeKind.PARTICIPATE]: {
    relationship: 'PARTICIPATE',
    targetLabel: 'SocialEvent',
    targetKey: 'eventId',
    createdAtExpression: 'toString(r.registeredAt)',
  },
};

export function buildReadCypher(kind: SocialEdgeKind): string {
  const shape = EDGE_SHAPES[kind];
  return `MATCH (u:SocialUser)-[r:${shape.relationship}]->(t:${shape.targetLabel})
       RETURN u.userId AS fromId, t.${shape.targetKey} AS toId, ${shape.createdAtExpression} AS createdAt
       ORDER BY fromId, toId
       SKIP $skip LIMIT $limit`;
}

export class Neo4jSocialEdgeSource implements SocialEdgeSource {
  constructor(
    private readonly driver: Driver,
    private readonly database?: string,
  ) {}

  async readBatch(kind: SocialEdgeKind, skip: number, limit: number): Promise<BackfillEdgeRow[]> {
    const session = this.driver.session({
      defaultAccessMode: neo4j.session.READ,
      ...(this.database ? { database: this.database } : {}),
    });
    try {
      const result = await session.run(buildReadCypher(kind), {
        skip: neo4j.int(skip),
        limit: neo4j.int(limit),
      });
      return result.records.map((record) => ({
        fromId: String(record.get('fromId')),
        toId: String(record.get('toId')),
        createdAt: (record.get('createdAt') as string | null) ?? null,
      }));
    } finally {
      await session.close();
    }
  }
}

const UNNEST_ROWS = `UNNEST($2::uuid[], $3::uuid[], $4::timestamptz[]) AS r(from_id, to_id, created_at)`;

const toColumns = (rows: BackfillEdgeRow[]): [string[], string[], (string | null)[]] => [
  rows.map((row) => row.fromId),
  rows.map((row) => row.toId),
  rows.map((row) => row.createdAt),
];

export class PostgresSocialEdgeSink implements SocialEdgeSink {
  constructor(private readonly dataSource: DataSource) {}

  async countMissing(kind: SocialEdgeKind, rows: BackfillEdgeRow[]): Promise<number> {
    const result = await this.dataSource.query<{ n: number }[]>(
      `SELECT count(*)::int AS n
       FROM ${UNNEST_ROWS}
       WHERE NOT EXISTS (
         SELECT 1 FROM social_edge e
         WHERE e.kind = $1 AND e.from_id = r.from_id AND e.to_id = r.to_id
       )`,
      [kind, ...toColumns(rows)],
    );
    return result[0]?.n ?? 0;
  }

  async insertMissing(kind: SocialEdgeKind, rows: BackfillEdgeRow[]): Promise<number> {
    const result = await this.dataSource.query<{ n: number }[]>(
      `WITH inserted AS (
         INSERT INTO social_edge (kind, from_id, to_id, created_at)
         SELECT $1, r.from_id, r.to_id, COALESCE(r.created_at, now())
         FROM ${UNNEST_ROWS}
         ON CONFLICT DO NOTHING
         RETURNING 1
       )
       SELECT count(*)::int AS n FROM inserted`,
      [kind, ...toColumns(rows)],
    );
    return result[0]?.n ?? 0;
  }
}
