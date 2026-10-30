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
} from '@volontariapp/domain-social';
import {
  AdminGetRecommendedEventIdsQueryDTO,
  GetEventAttendeesQueryDTO,
} from '../../../modules/participation/dto/participation.query.dto.js';
import { createMock } from '../../utils/mock.helper.js';

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
});
