import type { PaginationResponse } from '@volontariapp/contracts-nest';

export class PaginationResponseDTO implements PaginationResponse {
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
