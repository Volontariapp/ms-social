import type { PaginationResponseDTO } from './pagination-response.dto.js';

export class SuccessResponseDTO {
  success: boolean = true;
}

export class ExistsResponseDTO {
  exists!: boolean;
}

export class IdsResponseDTO {
  ids!: string[];
  pagination: PaginationResponseDTO | undefined;
}

export class IdResponseDTO {
  eventId!: string;
}
