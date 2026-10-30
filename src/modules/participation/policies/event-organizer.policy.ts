import { Injectable } from '@nestjs/common';
import type { AuthUser } from '@volontariapp/auth';
import { ParticipationService, PaginationVO, UserId } from '@volontariapp/domain-social';
import type { EventId } from '@volontariapp/domain-social';
import { ForbiddenError, UnauthorizedError } from '@volontariapp/errors';
import { UserRoles } from '@volontariapp/shared';
import { ORGANIZER_LOOKUP_PAGE_SIZE } from '../participation.constants.js';

@Injectable()
export class EventOrganizerPolicy {
  constructor(private readonly service: ParticipationService) {}

  /**
   * Allows the caller when it is an admin or the creator (CREATED edge) of the event.
   * Throws UnauthorizedError when no caller identity is present, ForbiddenError otherwise.
   */
  async assertCanManageAttendance(user: AuthUser | undefined, eventId: EventId): Promise<void> {
    if (!user?.id) {
      throw new UnauthorizedError('Missing caller identity', 'ATTENDANCE_UNAUTHENTICATED');
    }
    if (user.role === UserRoles.ADMIN.toString()) {
      return;
    }
    if (await this.isOrganizer(new UserId(user.id), eventId)) {
      return;
    }
    throw new ForbiddenError(
      'Only the event organizer or an admin can set the attendance',
      'ATTENDANCE_FORBIDDEN',
    );
  }

  private async isOrganizer(userId: UserId, eventId: EventId): Promise<boolean> {
    // TODO: replace this paging lookup (no ORDER BY, O(n) round trips, fails closed with a
    // false Forbidden) with domain-social isEventCreator (planned).
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const result = await this.service.getUserEvents(
        userId,
        new PaginationVO(page, ORGANIZER_LOOKUP_PAGE_SIZE),
      );
      if (result.ids.includes(eventId.value)) {
        return true;
      }
      totalPages = result.pagination.totalPages;
      page += 1;
    }
    return false;
  }
}
