import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetMyFollowsQuery,
  GetMyFollowersQuery,
  GetMyBlocksQuery,
  GetWhoBlockedMeQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../common/pagination.dto.js';

export class GetMyFollowsQueryDTO implements GetMyFollowsQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetMyFollowersQueryDTO implements GetMyFollowersQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetMyBlocksQueryDTO implements GetMyBlocksQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetWhoBlockedMeQueryDTO implements GetWhoBlockedMeQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
