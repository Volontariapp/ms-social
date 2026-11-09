import type { jest } from '@jest/globals';
import type {
  EventPostLinkService,
  ParticipationService,
  RelationshipService,
} from '@volontariapp/domain-social';
import { SearchExclusionsVO } from '@volontariapp/domain-social';
import { createMock } from '../../utils/mock.helper.js';

export interface Neo4jWarmupServicesMockBundle {
  participation: jest.Mocked<ParticipationService>;
  relationship: jest.Mocked<RelationshipService>;
  eventPostLink: jest.Mocked<EventPostLinkService>;
}

export const createNeo4jWarmupServicesMockBundle = (): Neo4jWarmupServicesMockBundle => {
  const participation = createMock<ParticipationService>();
  participation.getSearchExclusions.mockResolvedValue(new SearchExclusionsVO([], [], false, false));
  participation.countParticipantsByEventIds.mockResolvedValue([]);

  const relationship = createMock<RelationshipService>();
  relationship.isFollowing.mockResolvedValue(false);

  const eventPostLink = createMock<EventPostLinkService>();
  eventPostLink.getEventsRelatedToPosts.mockResolvedValue([]);

  return { participation, relationship, eventPostLink };
};
