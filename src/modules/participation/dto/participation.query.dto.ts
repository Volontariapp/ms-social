import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  GetRecommendedEventIdsQuery,
  AdminGetRecommendedEventIdsQuery,
  GetSearchExclusionsQuery,
  GetEventAttendeesQuery,
  CountEventParticipantsQuery,
} from '@volontariapp/contracts-nest';
import { PaginationRequestDTO } from '../../../common/dto/pagination.dto.js';

export class GetRecommendedEventIdsQueryDTO implements GetRecommendedEventIdsQuery {
  @IsOptional()
  @IsBoolean()
  excludeCreatedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeBlockedUsers!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeParticipatedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeWishedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyParticipatedByFriends!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyWishedByFriends!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyCreatedByFriends!: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class GetSearchExclusionsQueryDTO implements GetSearchExclusionsQuery {
  @IsOptional()
  @IsBoolean()
  excludeCreatedByMe = false;

  @IsOptional()
  @IsBoolean()
  excludeParticipatedByMe = false;

  @IsOptional()
  @IsBoolean()
  excludeWishedByMe = false;

  @IsOptional()
  @IsBoolean()
  excludeBlockedUsers = false;
}

export class AdminGetRecommendedEventIdsQueryDTO implements AdminGetRecommendedEventIdsQuery {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsOptional()
  @IsBoolean()
  excludeCreatedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeBlockedUsers!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeParticipatedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  excludeWishedByMe!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyParticipatedByFriends!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyWishedByFriends!: boolean;

  @IsOptional()
  @IsBoolean()
  onlyCreatedByFriends!: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

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

export class GetEventAttendeesQueryDTO implements GetEventAttendeesQuery {
  @IsString()
  eventId!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaginationRequestDTO)
  pagination: PaginationRequestDTO | undefined;
}

export class CountEventParticipantsQueryDTO implements CountEventParticipantsQuery {
  @IsArray()
  @ArrayMaxSize(100)
  @ArrayUnique()
  @IsString({ each: true })
  eventIds!: string[];
}
