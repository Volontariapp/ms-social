import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetUserLikesQuery,
  GetPostLikersQuery,
  AdminGetUserLikesQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';

export class GetUserLikesQueryDTO implements GetUserLikesQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetPostLikersQueryDTO implements GetPostLikersQuery {
  @IsString()
  postId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetUserLikesQueryDTO implements AdminGetUserLikesQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
