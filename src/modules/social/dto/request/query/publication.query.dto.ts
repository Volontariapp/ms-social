import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetSocialPostQuery,
  GetUserPostsQuery,
  GetFeedQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../common/pagination.dto.js';

export class GetSocialPostQueryDTO implements GetSocialPostQuery {
  @IsString()
  postId!: string;
}

export class GetUserPostsQueryDTO implements GetUserPostsQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetFeedQueryDTO implements GetFeedQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
