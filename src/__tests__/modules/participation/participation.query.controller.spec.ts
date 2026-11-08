import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ParticipationQueryController } from '../../../modules/participation/controllers/participation.query.controller.js';
import {
  ParticipationService,
  PaginatedIdsVO,
  PaginationResultVO,
  EventAttendeeVO,
  PaginatedAttendeesVO,
  EventParticipantCountVO,
  SearchExclusionsVO,
} from '@volontariapp/domain-social';
import {
  AdminGetRecommendedEventIdsQueryDTO,
  GetEventAttendeesQueryDTO,
  CountEventParticipantsQueryDTO,
  GetSearchExclusionsQueryDTO,
} from '../../../modules/participation/dto/participation.query.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('ParticipationQueryController', () => {
  let controller: ParticipationQueryController;
  let service: jest.Mocked<ParticipationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationQueryController],
      providers: [
        {
          provide: ParticipationService,
          useValue: createMock<ParticipationService>(),
        },
      ],
    }).compile();

    controller = module.get<ParticipationQueryController>(ParticipationQueryController);
    service = module.get(ParticipationService);
  });

  describe('adminGetRecommendedEventIds', () => {
    it('should read the recommendation of the user given in the payload with the given filters', async () => {
      const spy = jest
        .spyOn(service, 'getRecommendedEventIds')
        .mockResolvedValue(
          new PaginatedIdsVO(['event-1', 'event-2'], new PaginationResultVO(1, 1000, 2, 1)),
        );
      const dto = plainToInstance(AdminGetRecommendedEventIdsQueryDTO, {
        userId: 'user-42',
        excludeCreatedByMe: true,
        excludeBlockedUsers: true,
        excludeParticipatedByMe: true,
        excludeWishedByMe: true,
        onlyParticipatedByFriends: false,
        onlyWishedByFriends: false,
        onlyCreatedByFriends: false,
        pagination: { page: 1, limit: 1000 },
      });

      const result = await controller.adminGetRecommendedEventIds(dto);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'user-42' }),
        expect.objectContaining({
          excludeCreatedByMe: true,
          excludeBlockedUsers: true,
          excludeParticipatedByMe: true,
          excludeWishedByMe: true,
          onlyParticipatedByFriends: false,
        }),
        expect.objectContaining({ page: 1, limit: 1000 }),
      );
      expect(result.ids).toEqual(['event-1', 'event-2']);
    });

    it('should default to the first page of 10 when no pagination is given', async () => {
      const spy = jest
        .spyOn(service, 'getRecommendedEventIds')
        .mockResolvedValue(new PaginatedIdsVO([], new PaginationResultVO(1, 10, 0, 0)));
      const dto = plainToInstance(AdminGetRecommendedEventIdsQueryDTO, { userId: 'user-42' });

      await controller.adminGetRecommendedEventIds(dto);

      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({ page: 1, limit: 10 }),
      );
    });
  });

  describe('getSearchExclusions', () => {
    const user = createMockAuthUser({ id: 'user-from-token' });

    it('should read the exclusions of the authenticated user with the requested filters', async () => {
      const spy = jest
        .spyOn(service, 'getSearchExclusions')
        .mockResolvedValue(new SearchExclusionsVO(['event-1'], ['user-9'], false, true));
      const dto = plainToInstance(GetSearchExclusionsQueryDTO, {
        excludeCreatedByMe: true,
        excludeParticipatedByMe: false,
        excludeWishedByMe: true,
        excludeBlockedUsers: true,
      });

      const result = await controller.getSearchExclusions(dto, user);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'user-from-token' }), {
        excludeCreatedByMe: true,
        excludeParticipatedByMe: false,
        excludeWishedByMe: true,
        excludeBlockedUsers: true,
      });
      expect(result).toEqual({
        excludedEventIds: ['event-1'],
        hiddenUserIds: ['user-9'],
        excludedEventIdsTruncated: false,
        hiddenUserIdsTruncated: true,
      });
    });

    it('should treat a missing flag as false', async () => {
      const spy = jest
        .spyOn(service, 'getSearchExclusions')
        .mockResolvedValue(new SearchExclusionsVO([], [], false, false));

      await controller.getSearchExclusions(plainToInstance(GetSearchExclusionsQueryDTO, {}), user);

      expect(spy).toHaveBeenCalledWith(expect.anything(), {
        excludeCreatedByMe: false,
        excludeParticipatedByMe: false,
        excludeWishedByMe: false,
        excludeBlockedUsers: false,
      });
    });

    it('should ignore a user id sent in the payload', async () => {
      const spy = jest
        .spyOn(service, 'getSearchExclusions')
        .mockResolvedValue(new SearchExclusionsVO([], [], false, false));
      const dto = plainToInstance(GetSearchExclusionsQueryDTO, {
        userId: 'someone-else',
        excludeCreatedByMe: true,
      });

      await controller.getSearchExclusions(dto, user);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'user-from-token' }),
        expect.anything(),
      );
    });
  });

  describe('GetSearchExclusionsQueryDTO', () => {
    it('should accept an empty payload', async () => {
      await expect(
        validate(plainToInstance(GetSearchExclusionsQueryDTO, {})),
      ).resolves.toHaveLength(0);
    });

    it('should reject a non boolean flag', async () => {
      const errors = await validate(
        plainToInstance(GetSearchExclusionsQueryDTO, { excludeBlockedUsers: 'yes' }),
      );

      expect(errors.some((error) => error.property === 'excludeBlockedUsers')).toBe(true);
    });
  });

  describe('AdminGetRecommendedEventIdsQueryDTO', () => {
    it('should reject a payload without userId', async () => {
      const dto = plainToInstance(AdminGetRecommendedEventIdsQueryDTO, {});

      const errors = await validate(dto);

      expect(errors.some((error) => error.property === 'userId')).toBe(true);
    });

    it('should accept a payload with only a userId', async () => {
      const dto = plainToInstance(AdminGetRecommendedEventIdsQueryDTO, { userId: 'user-42' });

      await expect(validate(dto)).resolves.toHaveLength(0);
    });
  });

  describe('getEventAttendees', () => {
    it('should get attendees for an event with pagination', async () => {
      const mockAttendee = new EventAttendeeVO(
        'user-1',
        new Date('2026-10-25T10:00:00.000Z'),
        new Date('2026-10-25T11:00:00.000Z'),
      );
      const spy = jest
        .spyOn(service, 'getEventAttendees')
        .mockResolvedValue(
          new PaginatedAttendeesVO([mockAttendee], new PaginationResultVO(1, 100, 1, 1)),
        );
      const dto = plainToInstance(GetEventAttendeesQueryDTO, {
        eventId: 'event-123',
        pagination: { page: 1, limit: 100 },
      });

      const result = await controller.getEventAttendees(dto);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'event-123' }),
        expect.objectContaining({ page: 1, limit: 100 }),
      );
      expect(result.attendees).toHaveLength(1);
      expect(result.attendees[0].userId).toBe('user-1');
      expect(result.attendees[0].registeredAt).toBeDefined();
      expect(result.attendees[0].checkedInAt).toBeDefined();
      expect(result.pagination?.total).toBe(1);
    });
  });

  describe('countEventParticipants', () => {
    // Test nominal: verification de l appel au service avec les bons identifiants et du mapping de reponse
    it('should count participants for multiple events and map response', async () => {
      const mockCounts = [
        new EventParticipantCountVO('event-1', 42),
        new EventParticipantCountVO('event-2', 0),
      ];
      const spy = jest.spyOn(service, 'countParticipantsByEventIds').mockResolvedValue(mockCounts);

      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: ['event-1', 'event-2'],
      });

      const result = await controller.countEventParticipants(dto);

      expect(spy).toHaveBeenCalledWith([
        expect.objectContaining({ value: 'event-1' }),
        expect.objectContaining({ value: 'event-2' }),
      ]);
      expect(result.counts).toEqual([
        { eventId: 'event-1', participantCount: 42 },
        { eventId: 'event-2', participantCount: 0 },
      ]);
    });

    // Test avec liste vide
    it('should return empty counts when event ids list is empty', async () => {
      const spy = jest.spyOn(service, 'countParticipantsByEventIds').mockResolvedValue([]);

      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: [],
      });

      const result = await controller.countEventParticipants(dto);

      expect(spy).toHaveBeenCalledWith([]);
      expect(result.counts).toEqual([]);
    });
  });

  describe('CountEventParticipantsQueryDTO', () => {
    it('should validate with valid eventIds', async () => {
      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: ['event-1', 'event-2'],
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty array', async () => {
      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: [],
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when exceeding ceiling of 100', async () => {
      const eventIds = Array.from({ length: 101 }, (_, i) => `event-${String(i)}`);
      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'eventIds')).toBe(true);
    });

    it('should fail validation when duplicate eventIds are provided', async () => {
      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: ['event-1', 'event-1'],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'eventIds')).toBe(true);
    });

    it('should fail validation when element is not a string', async () => {
      const dto = plainToInstance(CountEventParticipantsQueryDTO, {
        eventIds: [123],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'eventIds')).toBe(true);
    });
  });
});
