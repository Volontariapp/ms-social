import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetEventRelatedToPostQuery,
  GetEventPostsQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../common/pagination.dto.js';

export class GetEventRelatedToPostQueryDTO implements GetEventRelatedToPostQuery {
  @IsString()
  postId!: string;
}

export class GetEventPostsQueryDTO implements GetEventPostsQuery {
  @IsString()
  eventId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
