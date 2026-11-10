import { jest } from '@jest/globals';
import type {
  BackfillEdgeRow,
  SocialEdgeSink,
  SocialEdgeSource,
} from '../../../scripts/backfill/social-edge-backfill.js';

/** A source that serves `rows` for every kind, honouring skip and limit like Neo4j does. */
export const createSocialEdgeSourceMock = (rows: BackfillEdgeRow[]): SocialEdgeSource => ({
  readBatch: jest
    .fn<SocialEdgeSource['readBatch']>()
    .mockImplementation((_kind, skip, limit) => Promise.resolve(rows.slice(skip, skip + limit))),
});

export const createSocialEdgeSinkMock = (): SocialEdgeSink => ({
  countMissing: jest
    .fn<SocialEdgeSink['countMissing']>()
    .mockImplementation((_kind, batch) => Promise.resolve(batch.length)),
  insertMissing: jest
    .fn<SocialEdgeSink['insertMissing']>()
    .mockImplementation((_kind, batch) => Promise.resolve(batch.length)),
});
