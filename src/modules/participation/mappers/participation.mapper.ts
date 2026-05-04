import { UserId, EventId } from '@volontariapp/domain-social';
import type { AuthUser } from '@volontariapp/auth';
import type {
  CreateSocialEventCommandDTO,
  DeleteSocialEventCommandDTO,
  PostUserEventCommandDTO,
  DeleteUserEventCommandDTO,
  PostUserParticipateEventCommandDTO,
  DeleteUserParticipateEventCommandDTO,
  PostUserWishEventCommandDTO,
  DeleteUserWishEventCommandDTO,
  AdminPostUserParticipateEventCommandDTO,
  AdminDeleteUserParticipateEventCommandDTO,
  AdminPostUserWishEventCommandDTO,
  AdminDeleteUserWishEventCommandDTO,
} from '../dto/participation.command.dto.js';
import type {
  GetSocialEventQueryDTO,
  GetUserEventQueryDTO,
  GetUserParticipateEventQueryDTO,
  GetEventParticipantsQueryDTO,
  GetUserWishEventQueryDTO,
  AdminGetUserEventQueryDTO,
  AdminGetUserParticipateEventQueryDTO,
  AdminGetUserWishEventQueryDTO,
} from '../dto/participation.query.dto.js';
import { PaginationMapper } from '../../../common/mappers/pagination.mapper.js';

export class ParticipationMapper {
  static toEventIdVO(eventId: string): EventId {
    return new EventId(eventId);
  }

  static toCreateEventParams(dto: CreateSocialEventCommandDTO): EventId {
    return this.toEventIdVO(dto.eventId);
  }

  static toDeleteEventParams(dto: DeleteSocialEventCommandDTO): EventId {
    return this.toEventIdVO(dto.eventId);
  }

  static toSetEventCreatorParams(dto: PostUserEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toRemoveEventCreatorParams(dto: DeleteUserEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toParticipateEventParams(
    dto: PostUserParticipateEventCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(user.id),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toLeaveEventParams(
    dto: DeleteUserParticipateEventCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(user.id),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toAdminParticipateEventParams(dto: AdminPostUserParticipateEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toAdminLeaveEventParams(dto: AdminDeleteUserParticipateEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toGetEventNodeParams(dto: GetSocialEventQueryDTO): EventId {
    return this.toEventIdVO(dto.eventId);
  }

  static toGetUserEventsParams(
    dto: GetUserEventQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetUserParticipationsParams(
    dto: GetUserParticipateEventQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetUserEventsParams(dto: AdminGetUserEventQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetUserParticipationsParams(dto: AdminGetUserParticipateEventQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toGetEventParticipantsParams(dto: GetEventParticipantsQueryDTO): {
    eventId: EventId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      eventId: this.toEventIdVO(dto.eventId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toWishEventParams(
    dto: PostUserWishEventCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(user.id),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toUnwishEventParams(
    dto: DeleteUserWishEventCommandDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(user.id),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toAdminWishEventParams(dto: AdminPostUserWishEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toAdminUnwishEventParams(dto: AdminDeleteUserWishEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toGetUserWishEventsParams(
    dto: GetUserWishEventQueryDTO,
    user: AuthUser,
  ): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(user.id),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }

  static toAdminGetUserWishEventsParams(dto: AdminGetUserWishEventQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination ? PaginationMapper.toPaginationVO(dto.pagination) : undefined,
    };
  }
}
