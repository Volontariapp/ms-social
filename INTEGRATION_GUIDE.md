# Service-Controller Integration Guide

## 📋 Overview

This guide shows how to **plug domain-social services into NestJS controllers** using the mapper pattern.

All services are fully typed with **Value Objects (VOs)**, and mappers bridge the gap between:
- **DTOs** (HTTP/gRPC request/response)
- **VOs** (Domain-Driven Design types)
- **Services** (business logic)

---

## ✅ Completed Controllers

### Publication
- ✅ `publication.command.controller.ts` — Create/Delete/Own posts
- ✅ `publication.query.controller.ts` — Get posts, feed

### Interaction
- ✅ `interaction.command.controller.ts` — Like/unlike posts
- ✅ `interaction.query.controller.ts` — Get likes, likers

### Relationship
- ✅ `relationship.command.controller.ts` — Follow/block users
- ✅ `relationship.query.controller.ts` — Get follows, followers, blocks

### User Node
- ✅ `user-node.command.controller.ts` — Create/delete users
- ✅ `user-node.query.controller.ts` — Check user exists

---

## 📝 Quick Integration Template

### Command Controller (Example: Participation)

```typescript
import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  PARTICIPATION_METHODS,
} from '@volontariapp/contracts-nest';
import { ParticipationService } from '@volontariapp/domain-social';
import {
  CreateSocialEventCommandDTO,
  DeleteSocialEventCommandDTO,
  PostUserEventCommandDTO,
  DeleteUserEventCommandDTO,
  PostUserParticipateEventCommandDTO,
  DeleteUserParticipateEventCommandDTO,
} from '../dto/request/command/participation.command.dto.js';
import {
  CreateEventNodeResponseDTO,
  DeleteEventNodeResponseDTO,
  PostUserEventResponseDTO,
  DeleteUserEventResponseDTO,
  PostUserParticipateEventResponseDTO,
  DeleteUserParticipateEventResponseDTO,
} from '../dto/response/social.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';

@Controller()
export class ParticipationCommandController {
  private readonly logger = new Logger({
    context: ParticipationCommandController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.CREATE_EVENT_NODE,
  )
  async createEventNode(
    data: CreateSocialEventCommandDTO,
  ): Promise<CreateEventNodeResponseDTO> {
    this.logger.log(`gRPC: Creating event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toCreateEventParams(data);
    await this.service.createEvent(eventId);
    return new CreateEventNodeResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_EVENT_NODE,
  )
  async deleteEventNode(
    data: DeleteSocialEventCommandDTO,
  ): Promise<DeleteEventNodeResponseDTO> {
    this.logger.log(`gRPC: Deleting event node for: ${data.eventId}`);
    const eventId = ParticipationMapper.toDeleteEventParams(data);
    await this.service.deleteEvent(eventId);
    return new DeleteEventNodeResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.POST_USER_EVENT,
  )
  async postUserEvent(
    data: PostUserEventCommandDTO,
  ): Promise<PostUserEventResponseDTO> {
    this.logger.log(
      `gRPC: User ${data.userId} created event ${data.eventId}`,
    );
    const { userId, eventId } =
      ParticipationMapper.toSetEventCreatorParams(data);
    await this.service.setEventCreator(userId, eventId);
    return new PostUserEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_USER_EVENT,
  )
  async deleteUserEvent(
    data: DeleteUserEventCommandDTO,
  ): Promise<DeleteUserEventResponseDTO> {
    this.logger.log(
      `gRPC: User ${data.userId} removed creator from event ${data.eventId}`,
    );
    const { userId, eventId } =
      ParticipationMapper.toRemoveEventCreatorParams(data);
    await this.service.removeEventCreator(userId, eventId);
    return new DeleteUserEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.POST_USER_PARTICIPATE_EVENT,
  )
  async postUserParticipateEvent(
    data: PostUserParticipateEventCommandDTO,
  ): Promise<PostUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: User ${data.userId} participating in event ${data.eventId}`,
    );
    const { userId, eventId } =
      ParticipationMapper.toParticipateEventParams(data);
    await this.service.participateEvent(userId, eventId);
    return new PostUserParticipateEventResponseDTO();
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_COMMAND_SERVICE,
    PARTICIPATION_METHODS.DELETE_USER_PARTICIPATE_EVENT,
  )
  async deleteUserParticipateEvent(
    data: DeleteUserParticipateEventCommandDTO,
  ): Promise<DeleteUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: User ${data.userId} leaving event ${data.eventId}`,
    );
    const { userId, eventId } =
      ParticipationMapper.toLeaveEventParams(data);
    await this.service.leaveEvent(userId, eventId);
    return new DeleteUserParticipateEventResponseDTO();
  }
}
```

### Query Controller (Example: Participation)

```typescript
import { Controller } from '@nestjs/common';
import { Logger } from '@volontariapp/logger';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GRPC_SERVICES,
  PARTICIPATION_METHODS,
} from '@volontariapp/contracts-nest';
import { ParticipationService, PaginationVO } from '@volontariapp/domain-social';
import {
  GetSocialEventQueryDTO,
  GetUserEventQueryDTO,
  GetUserParticipateEventQueryDTO,
  GetEventParticipantsQueryDTO,
} from '../dto/request/query/participation.query.dto.js';
import {
  GetEventNodeResponseDTO,
  GetUserEventResponseDTO,
  GetUserParticipateEventResponseDTO,
  GetEventParticipantsResponseDTO,
} from '../dto/response/social.response.dto.js';
import { ParticipationMapper } from '../mappers/participation.mapper.js';
import { PaginatedIdsMapper } from '../mappers/paginated-ids.mapper.js';

@Controller()
export class ParticipationQueryController {
  private readonly logger = new Logger({
    context: ParticipationQueryController.name,
  });

  constructor(private readonly service: ParticipationService) {}

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_EVENT_NODE,
  )
  async getEventNode(
    data: GetSocialEventQueryDTO,
  ): Promise<GetEventNodeResponseDTO> {
    this.logger.log(`gRPC: Checking event exists: ${data.eventId}`);
    const eventId = ParticipationMapper.toGetEventNodeParams(data);
    const exists = await this.service.getEventExists(eventId);
    return { exists };
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_USER_EVENT,
  )
  async getUserEvents(
    data: GetUserEventQueryDTO,
  ): Promise<GetUserEventResponseDTO> {
    this.logger.log(`gRPC: Getting events for user: ${data.userId}`);
    const { userId, pagination } =
      ParticipationMapper.toGetUserEventsParams(data);
    const paginationVO = pagination || new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserEvents(userId, paginationVO);
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_USER_PARTICIPATE_EVENT,
  )
  async getUserParticipations(
    data: GetUserParticipateEventQueryDTO,
  ): Promise<GetUserParticipateEventResponseDTO> {
    this.logger.log(
      `gRPC: Getting participations for user: ${data.userId}`,
    );
    const { userId, pagination } =
      ParticipationMapper.toGetUserParticipationsParams(data);
    const paginationVO = pagination || new PaginationVO(1, 10);
    const paginatedIds = await this.service.getUserParticipations(
      userId,
      paginationVO,
    );
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }

  @GrpcMethod(
    GRPC_SERVICES.PARTICIPATION_QUERY_SERVICE,
    PARTICIPATION_METHODS.GET_EVENT_PARTICIPANTS,
  )
  async getEventParticipants(
    data: GetEventParticipantsQueryDTO,
  ): Promise<GetEventParticipantsResponseDTO> {
    this.logger.log(`gRPC: Getting participants for event: ${data.eventId}`);
    const { eventId, pagination } =
      ParticipationMapper.toGetEventParticipantsParams(data);
    const paginationVO = pagination || new PaginationVO(1, 10);
    const paginatedIds = await this.service.getEventParticipants(
      eventId,
      paginationVO,
    );
    return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
  }
}
```

---

## 🔌 EventPostLink Controllers

### Command Controller
Follow the template above, use `EventPostLinkMapper` for mapping:

```typescript
const { postId, eventId } = EventPostLinkMapper.toLinkPostToEventParams(data);
await this.service.linkPostToEvent(postId, eventId);
```

### Query Controller
Use `PaginatedIdsMapper` for paginated responses:

```typescript
const eventId = EventPostLinkMapper.toGetEventRelatedToPostParams(data);
const result = await this.service.getEventRelatedToPost(postId);
```

---

## 🧪 Testing Pattern

Each mapper is easily testable with mocked DTOs:

```typescript
describe('ParticipationMapper', () => {
  it('should map CreateSocialEventCommandDTO to EventId', () => {
    const dto: CreateSocialEventCommandDTO = { eventId: '123' };
    const result = ParticipationMapper.toCreateEventParams(dto);
    expect(result.value).toBe('123');
  });

  it('should extract userId and eventId from PostUserEventCommandDTO', () => {
    const dto: PostUserEventCommandDTO = {
      userId: 'user-123',
      eventId: 'event-456',
    };
    const result = ParticipationMapper.toSetEventCreatorParams(dto);
    expect(result.userId.value).toBe('user-123');
    expect(result.eventId.value).toBe('event-456');
  });
});
```

---

## 🔍 Key Principles

1. **DTO → VO (Input)**: Mappers convert raw DTOs into typed VOs for services
2. **VO → DTO (Output)**: Mappers convert service responses back to DTOs
3. **No `any`**: All types are explicit (follows Volontariapp ENS)
4. **Single Responsibility**: Each mapper handles one entity
5. **Reusability**: Mappers used by both Command and Query controllers

---

## 📚 Service Signatures

All services expect **VOs** as parameters:

```typescript
// PublicationService
createPost(postId: PostId): Promise<void>
ownPost(userId: UserId, postId: PostId): Promise<void>
getUserPosts(userId: UserId, pagination: PaginationVO): Promise<PaginatedIdsVO>

// InteractionService
likePost(userId: UserId, postId: PostId): Promise<void>
getUserLikes(userId: UserId, pagination: PaginationVO): Promise<PaginatedIdsVO>

// RelationshipService
followUser(followerId: UserId, followedId: UserId): Promise<void>
getFollows(userId: UserId, pagination: PaginationVO): Promise<PaginatedIdsVO>

// ParticipationService
createEvent(eventId: EventId): Promise<void>
setEventCreator(userId: UserId, eventId: EventId): Promise<void>
getUserEvents(userId: UserId, pagination: PaginationVO): Promise<PaginatedIdsVO>

// EventPostLinkService
linkPostToEvent(postId: PostId, eventId: EventId): Promise<void>
getEventPosts(eventId: EventId, pagination: PaginationVO): Promise<PaginatedIdsVO>

// SocialUserService
createUser(userId: UserId): Promise<void>
getUserExists(userId: UserId): Promise<boolean>
```

---

## 🚀 Next Steps

1. ✅ Mappers created for all entities
2. ✅ Core controllers (Publication, Interaction, Relationship, UserNode) plugged
3. ⏳ **Remaining**: Plug Participation & EventPostLink controllers (use templates above)
4. ⏳ Wire into `social.module.ts` providers
5. ⏳ Run tests: `npm test` / `yarn test`

---

## 💡 Tips

- Always use mappers in controllers — never pass strings/objects directly to services
- Default pagination: `new PaginationVO(1, 10)` if not provided
- Check `mappers/README.md` for detailed mapper documentation
- Each mapper is independent — can be tested & maintained separately
