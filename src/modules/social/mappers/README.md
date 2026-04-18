# Service-Controller Integration Mappers

## Architecture Overview

This module provides **mappers** to integrate domain-social services with NestJS controllers. Each mapper handles the transformation between:
- **DTOs (Request)** → **VOs (Value Objects)** → **Services**
- **Services** → **VOs** → **DTOs (Response)**

## Mapper Files

### 1. **pagination.mapper.ts**
Transforms pagination requests/responses between DTOs and VOs.
- `toPaginationVO()`: Convert `PaginationRequestDTO` → `PaginationVO`
- `toPaginationResponseDTO()`: Convert `PaginationResultVO` → `PaginationResponseDTO`

**Usage:**
```typescript
const paginationVO = PaginationMapper.toPaginationVO(dto.pagination);
```

---

### 2. **user-node.mapper.ts**
Transforms user ID requests into VOs.
- `toUserIdVO()`: String → `UserId` VO
- `toUserIdVOFromCommand()`: `CreateSocialUserCommandDTO` → `UserId`
- `toUserIdVOFromQuery()`: `GetSocialUserQueryDTO` → `UserId`

**Usage:**
```typescript
const userId = UserNodeMapper.toUserIdVOFromCommand(data);
await this.service.createUser(userId);
```

---

### 3. **publication.mapper.ts**
Transforms publication (post) commands/queries into service-compatible VOs.

**Command Mappers:**
- `toPostIdVOFromCommand()`: `CreateSocialPostCommandDTO` → `PostId`
- `toDeletePostIdVOFromCommand()`: `DeleteSocialPostCommandDTO` → `PostId`
- `toOwnPostCommandParams()`: `PostUserOwnCommandDTO` → `{ userId, postId }`
- `toDisownPostCommandParams()`: `DeleteUserOwnCommandDTO` → `{ userId, postId }`

**Query Mappers:**
- `toGetUserPostsQueryParams()`: Extract userId + pagination
- `toGetFeedQueryParams()`: Extract userId + pagination

**Usage:**
```typescript
const { userId, postId } = PublicationMapper.toOwnPostCommandParams(data);
await this.service.ownPost(userId, postId);
```

---

### 4. **interaction.mapper.ts**
Transforms like/interaction commands/queries.

**Command Mappers:**
- `toLikePostParams()`: `PostLikePostCommandDTO` → `{ userId, postId }`
- `toUnlikePostParams()`: `DeleteLikePostCommandDTO` → `{ userId, postId }`

**Query Mappers:**
- `toGetUserLikesParams()`: Extract userId + pagination
- `toGetPostLikersParams()`: Extract postId + pagination

**Usage:**
```typescript
const { userId, postId } = InteractionMapper.toLikePostParams(data);
await this.service.likePost(userId, postId);
```

---

### 5. **relationship.mapper.ts**
Transforms follow/block relationship commands/queries.

**Command Mappers:**
- `toFollowUserParams()`: `PostFollowUserCommandDTO` → `{ followerId, followedId }`
- `toUnfollowUserParams()`: `DeleteFollowUserCommandDTO` → `{ followerId, followedId }`
- `toBlockUserParams()`: `PostBlockUserCommandDTO` → `{ blockerId, blockedId }`
- `toUnblockUserParams()`: `DeleteBlockUserCommandDTO` → `{ blockerId, blockedId }`

**Query Mappers:**
- `toGetFollowsParams()`: Extract userId + pagination
- `toGetFollowersParams()`: Extract userId + pagination
- `toGetBlocksParams()`: Extract userId + pagination
- `toGetWhoBlockedMeParams()`: Extract userId + pagination

**Usage:**
```typescript
const { followerId, followedId } = RelationshipMapper.toFollowUserParams(data);
await this.service.followUser(followerId, followedId);
```

---

### 6. **participation.mapper.ts**
Transforms event participation commands/queries.

**Command Mappers:**
- `toCreateEventParams()`: `CreateSocialEventCommandDTO` → `EventId`
- `toDeleteEventParams()`: `DeleteSocialEventCommandDTO` → `EventId`
- `toSetEventCreatorParams()`: `PostUserEventCommandDTO` → `{ userId, eventId }`
- `toRemoveEventCreatorParams()`: `DeleteUserEventCommandDTO` → `{ userId, eventId }`
- `toParticipateEventParams()`: `PostUserParticipateEventCommandDTO` → `{ userId, eventId }`
- `toLeaveEventParams()`: `DeleteUserParticipateEventCommandDTO` → `{ userId, eventId }`

**Query Mappers:**
- `toGetUserEventsParams()`: Extract userId + pagination
- `toGetUserParticipationsParams()`: Extract userId + pagination
- `toGetEventParticipantsParams()`: Extract eventId + pagination

**Usage:**
```typescript
const { userId, eventId } = ParticipationMapper.toSetEventCreatorParams(data);
await this.service.setEventCreator(userId, eventId);
```

---

### 7. **event-post-link.mapper.ts**
Transforms event-post link commands/queries.

**Command Mappers:**
- `toLinkPostToEventParams()`: `LinkPostToEventCommandDTO` → `{ postId, eventId }`
- `toUnlinkPostFromEventParams()`: `UnlinkPostFromEventCommandDTO` → `{ postId, eventId }`

**Query Mappers:**
- `toGetEventRelatedToPostParams()`: `GetEventRelatedToPostQueryDTO` → `PostId`
- `toGetEventPostsParams()`: Extract eventId + pagination

**Usage:**
```typescript
const { postId, eventId } = EventPostLinkMapper.toLinkPostToEventParams(data);
await this.service.linkPostToEvent(postId, eventId);
```

---

### 8. **paginated-ids.mapper.ts**
Transforms paginated ID responses from VOs to DTOs.

- `toPaginatedIdsResponseDTO()`: `PaginatedIdsVO` → `IdsResponseDTO`

**Usage:**
```typescript
const paginatedIds = await this.service.getUserLikes(userId, pagination);
return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
```

---

## Controller Integration Pattern

### Command Controller Example (Publication)
```typescript
@GrpcMethod(GRPC_SERVICES.PUBLICATION_COMMAND_SERVICE, PUBLICATION_METHODS.CREATE_POST_NODE)
async createPostNode(data: CreateSocialPostCommandDTO): Promise<CreatePostNodeResponseDTO> {
  const postId = PublicationMapper.toPostIdVOFromCommand(data);
  await this.service.createPost(postId);
  return new CreatePostNodeResponseDTO();
}
```

### Query Controller Example (Publication)
```typescript
@GrpcMethod(GRPC_SERVICES.PUBLICATION_QUERY_SERVICE, PUBLICATION_METHODS.GET_USER_POSTS)
async getUserPosts(data: GetUserPostsQueryDTO): Promise<GetUserPostsResponseDTO> {
  const { userId, pagination } = PublicationMapper.toGetUserPostsQueryParams(data);
  const paginationVO = pagination || new PaginationVO(1, 10);
  const paginatedIds = await this.service.getUserPosts(userId, paginationVO);
  return PaginatedIdsMapper.toPaginatedIdsResponseDTO(paginatedIds);
}
```

---

## Benefits

✅ **Type Safety**: Full TypeScript support with no `any` types  
✅ **Separation of Concerns**: DTOs isolated from domain VOs  
✅ **Reusability**: Mappers used across command & query controllers  
✅ **Testability**: Mappers easily mockable in unit tests  
✅ **Maintainability**: Single source of truth for DTO ↔ VO transformations  

---

## Implementation Checklist

- [x] `pagination.mapper.ts`
- [x] `user-node.mapper.ts`
- [x] `publication.mapper.ts`
- [x] `interaction.mapper.ts`
- [x] `relationship.mapper.ts`
- [x] `participation.mapper.ts`
- [x] `event-post-link.mapper.ts`
- [x] `paginated-ids.mapper.ts`
- [x] `publication.command.controller.ts` — plugged
- [x] `publication.query.controller.ts` — plugged
- [x] `interaction.command.controller.ts` — plugged
- [x] `interaction.query.controller.ts` — plugged
- [x] `relationship.command.controller.ts` — plugged
- [ ] `relationship.query.controller.ts` — ready to plug
- [ ] `user-node.command.controller.ts` — ready to plug
- [ ] `user-node.query.controller.ts` — ready to plug
- [ ] `participation.command.controller.ts` — ready to plug
- [ ] `participation.query.controller.ts` — ready to plug
- [ ] `event-post-link.command.controller.ts` — ready to plug
- [ ] `event-post-link.query.controller.ts` — ready to plug
