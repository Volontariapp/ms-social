import { Injectable } from '@nestjs/common';
import type { AuthUser } from '@volontariapp/auth';
import { ParticipationService, UserId } from '@volontariapp/domain-social';
import type { EventId } from '@volontariapp/domain-social';
import { ForbiddenError, UnauthorizedError } from '@volontariapp/errors';
import { UserRoles } from '@volontariapp/shared';

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
    if (await this.service.isEventCreator(new UserId(user.id), eventId)) {
      return;
    }
    throw new ForbiddenError(
      'Only the event organizer or an admin can set the attendance',
      'ATTENDANCE_FORBIDDEN',
    );
  }
}
