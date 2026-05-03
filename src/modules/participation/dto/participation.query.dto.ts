import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  GetUserEventQuery,
  GetUserParticipateEventQuery,
  GetEventParticipantsQuery,
  GetSocialEventQuery,
  GetUserWishEventQuery,
  AdminGetUserEventQuery,
  AdminGetUserParticipateEventQuery,
  AdminGetUserWishEventQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';

export class GetSocialEventQueryDTO implements GetSocialEventQuery {
  @IsString()
  eventId!: string;
}

export class GetUserEventQueryDTO implements GetUserEventQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetUserParticipateEventQueryDTO implements GetUserParticipateEventQuery {
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

export class GetUserWishEventQueryDTO implements GetUserWishEventQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetUserEventQueryDTO implements AdminGetUserEventQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetUserParticipateEventQueryDTO implements AdminGetUserParticipateEventQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class AdminGetUserWishEventQueryDTO implements AdminGetUserWishEventQuery {
  @IsString()
  userId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}
