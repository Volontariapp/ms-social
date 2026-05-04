import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetSocialPostQuery,
  GetUserPostsQuery,
  GetFeedQuery,
  AdminGetUserPostsQuery,
  AdminGetFeedQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';

export class GetSocialPostQueryDTO implements GetSocialPostQuery {
  @IsString()
  postId!: string;
}

export class GetUserPostsQueryDTO implements GetUserPostsQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetFeedQueryDTO implements GetFeedQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetUserPostsQueryDTO implements AdminGetUserPostsQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetFeedQueryDTO implements AdminGetFeedQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
