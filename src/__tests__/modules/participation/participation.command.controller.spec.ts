import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { ParticipationCommandController } from '../../../modules/participation/controllers/participation.command.controller.js';
import { ParticipationService } from '@volontariapp/domain-social';
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
} from '../../../modules/participation/dto/participation.response.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('ParticipationCommandController', () => {
  let controller: ParticipationCommandController;
  let service: jest.Mocked<ParticipationService>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationCommandController],
      providers: [
        {
          provide: ParticipationService,
          useValue: createMock<ParticipationService>(),
        },
      ],
    }).compile();

    controller = module.get<ParticipationCommandController>(ParticipationCommandController);
    service = module.get(ParticipationService);
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
});
