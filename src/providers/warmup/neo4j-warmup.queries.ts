import { EventId, PostId, UserId } from '@volontariapp/domain-social';
import type {
  EventPostLinkService,
  ParticipationService,
  RelationshipService,
} from '@volontariapp/domain-social';

/**
 * Identifiers that match no node, with the length of a real UUID: Neo4j keys its executable
 * query cache on the query text and on each parameter's type and size bucket, so a warm-up
 * value must look like a real one for the cached plan to be the one live traffic reuses.
 */
export const WARMUP_USER_ID = '00000000-0000-4000-8000-000000000001';
export const WARMUP_OTHER_USER_ID = '00000000-0000-4000-8000-000000000002';

/** List lengths replayed for the batch reads (pages of 1 to 100 ids, MAX_SOCIAL_BATCH_IDS). */
export const WARMUP_BATCH_SIZES: readonly number[] = [1, 10, 20, 50, 100];

export interface SearchExclusionFlags {
  excludeCreatedByMe: boolean;
  excludeParticipatedByMe: boolean;
  excludeWishedByMe: boolean;
  excludeBlockedUsers: boolean;
}

/**
 * Every non-empty combination of the four flags. The exclusion query interpolates the relation
 * types into its text, so each combination is a distinct plan. The clients use four of them
 * (nativapp explore, swipe, live events, and traffic-simulator with all four flags); the other
 * eleven cost one trivial query each and cover any client added later.
 */
export const SEARCH_EXCLUSION_FLAG_COMBINATIONS: readonly SearchExclusionFlags[] = Array.from(
  { length: 15 },
  (_, index) => {
    const bits = index + 1;
    return {
      excludeCreatedByMe: (bits & 1) !== 0,
      excludeParticipatedByMe: (bits & 2) !== 0,
      excludeWishedByMe: (bits & 4) !== 0,
      excludeBlockedUsers: (bits & 8) !== 0,
    };
  },
);

const warmupIds = (size: number, prefix: string): string[] =>
  Array.from({ length: size }, (_, index) => `${prefix}${index.toString(16).padStart(12, '0')}`);

export interface Neo4jWarmupServices {
  participation: ParticipationService;
  relationship: RelationshipService;
  eventPostLink: EventPostLinkService;
}

export type Neo4jWarmupQuery = () => Promise<unknown>;

/** The hot reads of the live mix (events-list-app, posts-list, is-following), with ids that match nothing. */
export const buildNeo4jWarmupQueries = (services: Neo4jWarmupServices): Neo4jWarmupQuery[] => {
  const userId = new UserId(WARMUP_USER_ID);
  const exclusions = SEARCH_EXCLUSION_FLAG_COMBINATIONS.map(
    (flags): Neo4jWarmupQuery =>
      () =>
        services.participation.getSearchExclusions(userId, flags),
  );
  const counts = WARMUP_BATCH_SIZES.map(
    (size): Neo4jWarmupQuery =>
      () =>
        services.participation.countParticipantsByEventIds(
          warmupIds(size, '00000000-0000-4000-9000-').map((id) => new EventId(id)),
        ),
  );
  const links = WARMUP_BATCH_SIZES.map(
    (size): Neo4jWarmupQuery =>
      () =>
        services.eventPostLink.getEventsRelatedToPosts(
          warmupIds(size, '00000000-0000-4000-a000-').map((id) => new PostId(id)),
        ),
  );
  const following: Neo4jWarmupQuery = () =>
    services.relationship.isFollowing(userId, new UserId(WARMUP_OTHER_USER_ID));

  return [...exclusions, ...counts, ...links, following];
};
