import type { jest } from '@jest/globals';
import type { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import { createMock } from '../../utils/mock.helper.js';

export const createEventOrganizerPolicyMock = (): jest.Mocked<EventOrganizerPolicy> =>
  createMock<EventOrganizerPolicy>();
