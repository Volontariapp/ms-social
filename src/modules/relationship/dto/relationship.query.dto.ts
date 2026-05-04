import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetMyFollowsQuery,
  GetMyFollowersQuery,
  GetMyBlocksQuery,
  GetWhoBlockedMeQuery,
  AdminGetMyFollowsQuery,
  AdminGetMyFollowersQuery,
  AdminGetMyBlocksQuery,
  AdminGetWhoBlockedMeQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';

export class GetMyFollowsQueryDTO implements GetMyFollowsQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetMyFollowersQueryDTO implements GetMyFollowersQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetMyBlocksQueryDTO implements GetMyBlocksQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetWhoBlockedMeQueryDTO implements GetWhoBlockedMeQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetMyFollowsQueryDTO implements AdminGetMyFollowsQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetMyFollowersQueryDTO implements AdminGetMyFollowersQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetMyBlocksQueryDTO implements AdminGetMyBlocksQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetWhoBlockedMeQueryDTO implements AdminGetWhoBlockedMeQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
