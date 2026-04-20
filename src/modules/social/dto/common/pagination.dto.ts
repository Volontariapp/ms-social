import { PaginationRequest } from '@volontariapp/contracts-nest';
import { IsInt, Min } from 'class-validator';

export class PaginationRequestDTO implements PaginationRequest {
  @IsInt()
  @Min(1)
  page!: number;

  @IsInt()
  @Min(1)
  limit!: number;
}
