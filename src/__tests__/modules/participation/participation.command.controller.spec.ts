import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ParticipationCommandController } from '../../../modules/participation/controllers/participation.command.controller.js';
import { ParticipationService } from '@volontariapp/domain-social';
import { ForbiddenError } from '@volontariapp/errors';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type {
  CreateSocialEventCommandDTO,
  DeleteSocialEventCommandDTO,
  PostUserEventCommandDTO,
  DeleteUserEventCommandDTO,
  PostUserParticipateEventCommandDTO,
  DeleteUserParticipateEventCommandDTO,
  PostUserWishEventCommandDTO,
  DeleteUserWishEventCommandDTO,
} from '../../../modules/participation/dto/participation.command.dto.js';
import {
  CreateEventNodeResponseDTO,
  DeleteEventNodeResponseDTO,
  PostUserEventResponseDTO,
  DeleteUserEventResponseDTO,
  PostUserParticipateEventResponseDTO,
  DeleteUserParticipateEventResponseDTO,
  PostUserWishEventResponseDTO,
  DeleteUserWishEventResponseDTO,
  SetEventAttendanceResponseDTO,
} from '../../../modules/participation/dto/participation.response.dto.js';
import { SetEventAttendanceCommandDTO as SetEventAttendanceDtoClass } from '../../../modules/participation/dto/participation.command.dto.js';
import { EventOrganizerPolicy } from '../../../modules/participation/policies/event-organizer.policy.js';
import { MAX_ATTENDANCE_BATCH_SIZE } from '../../../modules/participation/participation.constants.js';
import { createEventOrganizerPolicyMock } from './event-organizer.policy.mock.js';
import { createSetEventAttendanceDto } from './participation.factory.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('ParticipationCommandController', () => {
  let controller: ParticipationCommandController;
  let service: jest.Mocked<ParticipationService>;
  let policy: jest.Mocked<EventOrganizerPolicy>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationCommandController],
      providers: [
        {
          provide: ParticipationService,
          useValue: createMock<ParticipationService>(),
        },
        {
          provide: EventOrganizerPolicy,
          useValue: createEventOrganizerPolicyMock(),
        },
      ],
    }).compile();

    controller = module.get<ParticipationCommandController>(ParticipationCommandController);
    service = module.get(ParticipationService);
    policy = module.get(EventOrganizerPolicy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createEventNode', () => {
    it('should create an event node successfully', async () => {
      const dto: CreateSocialEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'createEvent');
      const result = await controller.createEventNode(dto);

      expect(result).toBeInstanceOf(CreateEventNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'event-123' }));
    });
  });

  describe('deleteEventNode', () => {
    it('should delete an event node successfully', async () => {
      const dto: DeleteSocialEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'deleteEvent');
      const result = await controller.deleteEventNode(dto);

      expect(result).toBeInstanceOf(DeleteEventNodeResponseDTO);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: 'event-123' }));
    });
  });

  describe('postUserEvent', () => {
    it('should link user as creator successfully', async () => {
      const dto: PostUserEventCommandDTO = { userId: 'user-123', eventId: 'event-123' };
      const spy = jest.spyOn(service, 'setEventCreator');
      const result = await controller.postUserEvent(dto);

      expect(result).toBeInstanceOf(PostUserEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'user-123' }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('deleteUserEvent', () => {
    it('should unlink user as creator successfully', async () => {
      const dto: DeleteUserEventCommandDTO = { userId: 'user-123', eventId: 'event-123' };
      const spy = jest.spyOn(service, 'removeEventCreator');
      const result = await controller.deleteUserEvent(dto);

      expect(result).toBeInstanceOf(DeleteUserEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'user-123' }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('postUserParticipateEvent', () => {
    it('should participate to event successfully', async () => {
      const dto: PostUserParticipateEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'participateEvent');
      const result = await controller.postUserParticipateEvent(dto, mockUser);

      expect(result).toBeInstanceOf(PostUserParticipateEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('deleteUserParticipateEvent', () => {
    it('should leave event successfully', async () => {
      const dto: DeleteUserParticipateEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'leaveEvent');
      const result = await controller.deleteUserParticipateEvent(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteUserParticipateEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('postUserWishEvent', () => {
    it('should wish for event successfully', async () => {
      const dto: PostUserWishEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'wishEvent');
      const result = await controller.postUserWishEvent(dto, mockUser);

      expect(result).toBeInstanceOf(PostUserWishEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('deleteUserWishEvent', () => {
    it('should unwish from event successfully', async () => {
      const dto: DeleteUserWishEventCommandDTO = { eventId: 'event-123' };
      const spy = jest.spyOn(service, 'unwishEvent');
      const result = await controller.deleteUserWishEvent(dto, mockUser);

      expect(result).toBeInstanceOf(DeleteUserWishEventResponseDTO);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: mockUser.id }),
        expect.objectContaining({ value: 'event-123' }),
      );
    });
  });

  describe('setEventAttendance', () => {
    it('should set event attendance when the caller is allowed', async () => {
      const dto = createSetEventAttendanceDto();
      const policySpy = jest
        .spyOn(policy, 'assertCanManageAttendance')
        .mockResolvedValue(undefined);
      const spy = jest.spyOn(service, 'setEventAttendance').mockResolvedValue(undefined);
      const result = await controller.setEventAttendance(dto, mockUser);

      expect(result).toBeInstanceOf(SetEventAttendanceResponseDTO);
      expect(policySpy).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ value: 'event-123' }),
      );
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'event-123' }),
        ['u-1', 'u-2'],
        ['u-3'],
      );
    });

    it('should reject a non organizer and not write the attendance', async () => {
      const dto = createSetEventAttendanceDto();
      jest.spyOn(policy, 'assertCanManageAttendance').mockRejectedValue(new ForbiddenError());
      const spy = jest.spyOn(service, 'setEventAttendance').mockResolvedValue(undefined);

      await expect(controller.setEventAttendance(dto, mockUser)).rejects.toBeInstanceOf(
        ForbiddenError,
      );
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('SetEventAttendanceCommandDTO validation', () => {
    it('should accept a batch at the size limit', async () => {
      const ids = Array.from({ length: MAX_ATTENDANCE_BATCH_SIZE }, (_, i) => `u-${String(i)}`);
      const dto = plainToInstance(
        SetEventAttendanceDtoClass,
        createSetEventAttendanceDto({ checkedUserIds: ids }),
      );

      await expect(validate(dto)).resolves.toHaveLength(0);
    });

    it('should reject a batch above the size limit', async () => {
      const ids = Array.from({ length: MAX_ATTENDANCE_BATCH_SIZE + 1 }, (_, i) => `u-${String(i)}`);
      const checked = plainToInstance(
        SetEventAttendanceDtoClass,
        createSetEventAttendanceDto({ checkedUserIds: ids }),
      );
      const unchecked = plainToInstance(
        SetEventAttendanceDtoClass,
        createSetEventAttendanceDto({ uncheckedUserIds: ids }),
      );

      await expect(validate(checked)).resolves.toHaveLength(1);
      await expect(validate(unchecked)).resolves.toHaveLength(1);
    });
  });
});
