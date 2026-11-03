import { describe, it, expect } from '@jest/globals';
import { EventId, EventParticipantCountVO } from '@volontariapp/domain-social';
import { ParticipationMapper } from '../../../modules/participation/mappers/participation.mapper.js';
import type { CountEventParticipantsQueryDTO } from '../../../modules/participation/dto/participation.query.dto.js';

describe('ParticipationMapper', () => {
  describe('toCountEventParticipantsParams', () => {
    it('should convert CountEventParticipantsQueryDTO to array of EventId', () => {
      const dto: CountEventParticipantsQueryDTO = {
        eventIds: ['event-1', 'event-2'],
      };
      const result = ParticipationMapper.toCountEventParticipantsParams(dto);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(EventId);
      expect(result[0].value).toBe('event-1');
      expect(result[1]).toBeInstanceOf(EventId);
      expect(result[1].value).toBe('event-2');
    });
  });

  describe('toEventParticipantCountDTO', () => {
    it('should map EventParticipantCountVO to DTO', () => {
      const vo = new EventParticipantCountVO('event-1', 42);
      const result = ParticipationMapper.toEventParticipantCountDTO(vo);

      expect(result).toEqual({
        eventId: 'event-1',
        participantCount: 42,
      });
    });
  });

  describe('toCountEventParticipantsResponseDTO', () => {
    it('should map array of EventParticipantCountVO to response DTO', () => {
      const results = [
        new EventParticipantCountVO('event-1', 42),
        new EventParticipantCountVO('event-2', 0),
      ];
      const response = ParticipationMapper.toCountEventParticipantsResponseDTO(results);

      expect(response.counts).toHaveLength(2);
      expect(response.counts[0]).toEqual({
        eventId: 'event-1',
        participantCount: 42,
      });
      expect(response.counts[1]).toEqual({
        eventId: 'event-2',
        participantCount: 0,
      });
    });
  });
});
