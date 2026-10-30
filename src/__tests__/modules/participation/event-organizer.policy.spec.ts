import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { ParticipationService } from '@volontariapp/domain-social';
import { EventId, UserId } from '@volontariapp/domain-social';
import { ForbiddenError, UnauthorizedError } from '@volontariapp/errors';
import { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import type { AuthUser } from '@volontariapp/auth';
import { createMockAuthUser } from '../../utils/mock.helper.js';
import { createParticipationServiceMock } from './event-organizer.policy.mock.js';

describe('EventOrganizerPolicy', () => {
  let policy: EventOrganizerPolicy;
  let service: jest.Mocked<ParticipationService>;
  const eventId = new EventId('event-123');

  beforeEach(() => {
    service = createParticipationServiceMock();
    policy = new EventOrganizerPolicy(service);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows the creator of the event', async () => {
    const spy = jest.spyOn(service, 'isEventCreator').mockResolvedValue(true);

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(new UserId('org-1'), eventId);
  });

  it('rejects a user who did not create the event', async () => {
    const spy = jest.spyOn(service, 'isEventCreator').mockResolvedValue(false);

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'intruder' }), eventId),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('allows an admin without looking up the creator', async () => {
    const spy = jest.spyOn(service, 'isEventCreator');

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ role: 'ADMIN' }), eventId),
    ).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects an undefined caller as unauthorized', async () => {
    const spy = jest.spyOn(service, 'isEventCreator');
    const missing = undefined as AuthUser | undefined;

    await expect(policy.assertCanManageAttendance(missing, eventId)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('propagates a service error instead of masking it as forbidden', async () => {
    const failure = new Error('neo4j down');
    jest.spyOn(service, 'isEventCreator').mockRejectedValue(failure);

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).rejects.toBe(failure);
  });
});
