import { jest } from '@jest/globals';
import { describe, it, expect, afterEach } from '@jest/globals';
import { SocialEdgeKind } from '@volontariapp/messaging';
import { runSocialEdgeBackfill } from '../../../scripts/backfill/social-edge-backfill.js';
import { buildReadCypher } from '../../../scripts/backfill/social-edge-backfill.adapters.js';
import {
  createSocialEdgeSinkMock,
  createSocialEdgeSourceMock,
} from './social-edge-backfill.mock.js';
import { ALL_KINDS, createBackfillRow, createBackfillRows } from './social-edge.factory.js';

describe('runSocialEdgeBackfill', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dry run counts and never writes', async () => {
    const source = createSocialEdgeSourceMock(createBackfillRows(5));
    const sink = createSocialEdgeSinkMock();
    const insertSpy = jest.spyOn(sink, 'insertMissing');
    const countSpy = jest.spyOn(sink, 'countMissing');

    const report = await runSocialEdgeBackfill(source, sink, { dryRun: true, batchSize: 2 });

    expect(insertSpy).not.toHaveBeenCalled();
    expect(countSpy).toHaveBeenCalled();
    expect(report.dryRun).toBe(true);
    expect(report.kinds).toHaveLength(ALL_KINDS.length);
    for (const kindReport of report.kinds) {
      expect(kindReport.read).toBe(5);
      expect(kindReport.missing).toBe(5);
      expect(kindReport.inserted).toBe(0);
    }
  });

  it('apply inserts by batches of the requested size', async () => {
    const source = createSocialEdgeSourceMock(createBackfillRows(5));
    const sink = createSocialEdgeSinkMock();
    const insertSpy = jest.spyOn(sink, 'insertMissing');
    const countSpy = jest.spyOn(sink, 'countMissing');

    const report = await runSocialEdgeBackfill(source, sink, {
      dryRun: false,
      batchSize: 2,
      kinds: [SocialEdgeKind.LIKE],
    });

    expect(countSpy).not.toHaveBeenCalled();
    expect(insertSpy).toHaveBeenCalledTimes(3);
    expect(report.kinds).toEqual([
      { kind: SocialEdgeKind.LIKE, read: 5, skippedInvalidId: 0, missing: 5, inserted: 5 },
    ]);
  });

  it('is idempotent: rows already present are not counted as inserted', async () => {
    const source = createSocialEdgeSourceMock(createBackfillRows(3));
    const sink = createSocialEdgeSinkMock();
    jest.spyOn(sink, 'insertMissing').mockResolvedValue(0);

    const report = await runSocialEdgeBackfill(source, sink, {
      dryRun: false,
      batchSize: 10,
      kinds: [SocialEdgeKind.FOLLOW],
    });

    expect(report.kinds[0]?.inserted).toBe(0);
  });

  it('skips rows whose ids are not uuids instead of failing the batch', async () => {
    const source = createSocialEdgeSourceMock([
      createBackfillRow(),
      createBackfillRow({ toId: 'not-a-uuid' }),
    ]);
    const sink = createSocialEdgeSinkMock();
    const insertSpy = jest.spyOn(sink, 'insertMissing');

    const report = await runSocialEdgeBackfill(source, sink, {
      dryRun: false,
      batchSize: 10,
      kinds: [SocialEdgeKind.LIKE],
    });

    expect(report.kinds[0]).toMatchObject({ read: 2, skippedInvalidId: 1, inserted: 1 });
    expect(insertSpy).toHaveBeenCalledWith(SocialEdgeKind.LIKE, [createBackfillRow()]);
  });

  it('rejects an invalid batch size', async () => {
    await expect(
      runSocialEdgeBackfill(createSocialEdgeSourceMock([]), createSocialEdgeSinkMock(), {
        dryRun: true,
        batchSize: 0,
      }),
    ).rejects.toThrow('batchSize');
  });
});

describe('buildReadCypher', () => {
  it('reads WISH from the WISH_TO_PARTICIPATE relation and PARTICIPATE with its date', () => {
    expect(buildReadCypher(SocialEdgeKind.WISH)).toContain('[r:WISH_TO_PARTICIPATE]');
    expect(buildReadCypher(SocialEdgeKind.PARTICIPATE)).toContain('toString(r.registeredAt)');
    expect(buildReadCypher(SocialEdgeKind.LIKE)).toContain('SocialPost');
  });
});
