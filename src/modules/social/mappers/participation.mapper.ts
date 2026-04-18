import { UserId, EventId } from '@volontariapp/domain-social';
import type {
  CreateSocialEventCommandDTO,
  DeleteSocialEventCommandDTO,
  PostUserEventCommandDTO,
  DeleteUserEventCommandDTO,
  PostUserParticipateEventCommandDTO,
  DeleteUserParticipateEventCommandDTO,
} from '../dto/request/command/participation.command.dto.js';
import type {
  GetSocialEventQueryDTO,
  GetUserEventQueryDTO,
  GetUserParticipateEventQueryDTO,
  GetEventParticipantsQueryDTO,
} from '../dto/request/query/participation.query.dto.js';
import { PaginationMapper } from './pagination.mapper.js';

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

  static toParticipateEventParams(dto: PostUserParticipateEventCommandDTO): {
    userId: UserId;
    eventId: EventId;
  } {
    return {
      userId: new UserId(dto.userId),
      eventId: this.toEventIdVO(dto.eventId),
    };
  }

  static toLeaveEventParams(dto: DeleteUserParticipateEventCommandDTO): {
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

  static toGetUserEventsParams(dto: GetUserEventQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination
        ? PaginationMapper.toPaginationVO(dto.pagination)
        : undefined,
    };
  }

  static toGetUserParticipationsParams(dto: GetUserParticipateEventQueryDTO): {
    userId: UserId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      userId: new UserId(dto.userId),
      pagination: dto.pagination
        ? PaginationMapper.toPaginationVO(dto.pagination)
        : undefined,
    };
  }

  static toGetEventParticipantsParams(dto: GetEventParticipantsQueryDTO): {
    eventId: EventId;
    pagination: ReturnType<typeof PaginationMapper.toPaginationVO> | undefined;
  } {
    return {
      eventId: this.toEventIdVO(dto.eventId),
      pagination: dto.pagination
        ? PaginationMapper.toPaginationVO(dto.pagination)
        : undefined,
    };
  }
}
