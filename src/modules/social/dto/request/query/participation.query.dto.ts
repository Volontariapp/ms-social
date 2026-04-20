import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetUserEventQuery,
  GetUserParticipateEventQuery,
  GetEventParticipantsQuery,
  GetSocialEventQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../common/pagination.dto.js';

export class GetSocialEventQueryDTO implements GetSocialEventQuery {
  @IsString()
  eventId!: string;
}

export class GetUserEventQueryDTO implements GetUserEventQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetUserParticipateEventQueryDTO implements GetUserParticipateEventQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetEventParticipantsQueryDTO implements GetEventParticipantsQuery {
  @IsString()
  eventId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
