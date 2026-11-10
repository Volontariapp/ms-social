import { SocialEdgeKind } from '@volontariapp/messaging';
import type { BackfillEdgeRow } from '../../../scripts/backfill/social-edge-backfill.js';

export const USER_ID = '11111111-1111-4111-8111-111111111111';
export const OTHER_USER_ID = '22222222-2222-4222-8222-222222222222';
export const POST_ID = '33333333-3333-4333-8333-333333333333';
export const EVENT_ID = '44444444-4444-4444-8444-444444444444';

export const createBackfillRow = (overrides: Partial<BackfillEdgeRow> = {}): BackfillEdgeRow => ({
  fromId: USER_ID,
  toId: POST_ID,
  createdAt: null,
  ...overrides,
});

export const createBackfillRows = (count: number): BackfillEdgeRow[] =>
  Array.from({ length: count }, (_, index) =>
    createBackfillRow({
      toId: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    }),
  );

export const ALL_KINDS: SocialEdgeKind[] = [
  SocialEdgeKind.LIKE,
  SocialEdgeKind.FOLLOW,
  SocialEdgeKind.WISH,
  SocialEdgeKind.PARTICIPATE,
];
