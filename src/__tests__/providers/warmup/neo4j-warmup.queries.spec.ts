import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import {
  SEARCH_EXCLUSION_FLAG_COMBINATIONS,
  WARMUP_BATCH_SIZES,
  WARMUP_USER_ID,
  buildNeo4jWarmupQueries,
} from '../../../providers/warmup/neo4j-warmup.queries.js';
import type { Neo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';
import { createNeo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';

const UUID_LENGTH = 36;

describe('buildNeo4jWarmupQueries', () => {
  let services: Neo4jWarmupServicesMockBundle;

  beforeEach(() => {
    services = createNeo4jWarmupServicesMockBundle();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should cover the 15 non-empty combinations of the exclusion flags, each once', () => {
    const keys = SEARCH_EXCLUSION_FLAG_COMBINATIONS.map((flags) => JSON.stringify(flags));

    expect(new Set(keys).size).toBe(15);
    expect(
      SEARCH_EXCLUSION_FLAG_COMBINATIONS.every(
        (flags) =>
          flags.excludeCreatedByMe ||
          flags.excludeParticipatedByMe ||
          flags.excludeWishedByMe ||
          flags.excludeBlockedUsers,
      ),
    ).toBe(true);
  });

  it('should include the combinations sent by nativapp and traffic-simulator', () => {
    const used = [
      { c: true, p: false, w: false, b: false },
      { c: true, p: true, w: true, b: false },
      { c: true, p: true, w: false, b: true },
      { c: true, p: true, w: true, b: true },
    ];

    for (const { c, p, w, b } of used) {
      expect(SEARCH_EXCLUSION_FLAG_COMBINATIONS).toContainEqual({
        excludeCreatedByMe: c,
        excludeParticipatedByMe: p,
        excludeWishedByMe: w,
        excludeBlockedUsers: b,
      });
    }
  });

  it('should replay every hot read once per round', async () => {
    const exclusionsSpy = jest.spyOn(services.participation, 'getSearchExclusions');
    const countSpy = jest.spyOn(services.participation, 'countParticipantsByEventIds');
    const linksSpy = jest.spyOn(services.eventPostLink, 'getEventsRelatedToPosts');
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');

    const queries = buildNeo4jWarmupQueries(services);
    await Promise.all(queries.map((query) => query()));

    expect(queries).toHaveLength(15 + 2 * WARMUP_BATCH_SIZES.length + 1);
    expect(exclusionsSpy).toHaveBeenCalledTimes(15);
    expect(countSpy).toHaveBeenCalledTimes(WARMUP_BATCH_SIZES.length);
    expect(linksSpy).toHaveBeenCalledTimes(WARMUP_BATCH_SIZES.length);
    expect(followSpy).toHaveBeenCalledTimes(1);
  });

  it('should send identifiers shaped like real UUIDs, with the configured list lengths', async () => {
    const exclusionsSpy = jest.spyOn(services.participation, 'getSearchExclusions');
    const countSpy = jest.spyOn(services.participation, 'countParticipantsByEventIds');

    await Promise.all(buildNeo4jWarmupQueries(services).map((query) => query()));

    const [userId] = exclusionsSpy.mock.calls[0];
    expect(userId.value).toBe(WARMUP_USER_ID);
    const lengths = countSpy.mock.calls.map(([ids]) => ids.length);
    expect(lengths).toEqual([...WARMUP_BATCH_SIZES]);
    const allIds = countSpy.mock.calls.flatMap(([ids]) => ids.map((id) => id.value));
    expect(allIds.every((id) => id.length === UUID_LENGTH)).toBe(true);
    expect(new Set(countSpy.mock.calls[4][0].map((id) => id.value)).size).toBe(100);
  });
});
