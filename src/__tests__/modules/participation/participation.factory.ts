import type { SetEventAttendanceCommandDTO } from '../../../modules/participation/dto/participation.command.dto.js';

export const createSetEventAttendanceDto = (
  overrides: Partial<SetEventAttendanceCommandDTO> = {},
): SetEventAttendanceCommandDTO => ({
  eventId: 'event-123',
  checkedUserIds: ['u-1', 'u-2'],
  uncheckedUserIds: ['u-3'],
  ...overrides,
});
