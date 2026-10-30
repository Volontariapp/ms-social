import type { jest } from '@jest/globals';
import type { ParticipationService } from '@volontariapp/domain-social';
import type { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import { createMock } from '../../utils/mock.helper.js';

export const createEventOrganizerPolicyMock = (): jest.Mocked<EventOrganizerPolicy> =>
  createMock<EventOrganizerPolicy>();

export const createParticipationServiceMock = (): jest.Mocked<ParticipationService> =>
  createMock<ParticipationService>();
