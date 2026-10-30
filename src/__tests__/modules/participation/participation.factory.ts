import { PaginatedIdsVO, PaginationResultVO } from '@volontariapp/domain-social';
import type { SetEventAttendanceCommandDTO } from '../../../modules/participation/dto/participation.command.dto.js';

export const createSetEventAttendanceDto = (
  overrides: Partial<SetEventAttendanceCommandDTO> = {},
): SetEventAttendanceCommandDTO => ({
  eventId: 'event-123',
  checkedUserIds: ['u-1', 'u-2'],
  uncheckedUserIds: ['u-3'],
  ...overrides,
});

export const createPaginatedIds = (
  ids: string[],
  page = 1,
  limit = 100,
  total = ids.length,
  totalPages = 1,
): PaginatedIdsVO =>
  new PaginatedIdsVO(ids, new PaginationResultVO(page, limit, total, totalPages));
