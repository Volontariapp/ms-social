import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { ParticipationService } from '@volontariapp/domain-social';
import { EventId } from '@volontariapp/domain-social';
import { ForbiddenError, UnauthorizedError } from '@volontariapp/errors';
import { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import type { AuthUser } from '@volontariapp/auth';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';
import { createPaginatedIds } from './participation.factory.js';

describe('EventOrganizerPolicy', () => {
  let policy: EventOrganizerPolicy;
  let service: jest.Mocked<ParticipationService>;
  const eventId = new EventId('event-123');

  beforeEach(() => {
    service = createMock<ParticipationService>();
    policy = new EventOrganizerPolicy(service);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows the organizer of the event', async () => {
    const spy = jest
      .spyOn(service, 'getUserEvents')
      .mockResolvedValue(createPaginatedIds(['other', 'event-123']));

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('finds the event on a later page of created events', async () => {
    const spy = jest
      .spyOn(service, 'getUserEvents')
      .mockResolvedValueOnce(createPaginatedIds(['a'], 1, 100, 101, 2))
      .mockResolvedValueOnce(createPaginatedIds(['event-123'], 2, 100, 101, 2));

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('allows an admin without looking up the creator', async () => {
    const spy = jest.spyOn(service, 'getUserEvents');

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ role: 'ADMIN' }), eventId),
    ).resolves.toBeUndefined();
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects a user who did not create the event', async () => {
    jest.spyOn(service, 'getUserEvents').mockResolvedValue(createPaginatedIds(['other']));

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'intruder' }), eventId),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('rejects when the event is absent after exhausting several pages', async () => {
    const spy = jest
      .spyOn(service, 'getUserEvents')
      .mockResolvedValueOnce(createPaginatedIds(['a'], 1, 100, 201, 3))
      .mockResolvedValueOnce(createPaginatedIds(['b'], 2, 100, 201, 3))
      .mockResolvedValueOnce(createPaginatedIds(['c'], 3, 100, 201, 3));

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('rejects when the first page is empty', async () => {
    jest.spyOn(service, 'getUserEvents').mockResolvedValue(createPaginatedIds([], 1, 100, 0, 0));

    await expect(
      policy.assertCanManageAttendance(createMockAuthUser({ id: 'org-1' }), eventId),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('rejects an undefined caller as unauthorized', async () => {
    const spy = jest.spyOn(service, 'getUserEvents');
    const missing = undefined as AuthUser | undefined;

    await expect(policy.assertCanManageAttendance(missing, eventId)).rejects.toBeInstanceOf(
      UnauthorizedError,
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
