import { UserId } from '@volontariapp/domain-social';
import { UserNodeMapper } from './user-node.mapper';
import { CreateSocialUserCommandDTO } from '../dto/request/command/user-node.command.dto';
import { GetSocialUserQueryDTO } from '../dto/request/query/user-node.query.dto';

describe('UserNodeMapper', () => {
  describe('toUserIdVO', () => {
    it('should create a UserId VO from string', () => {
      const userId = 'user-123';
      const result = UserNodeMapper.toUserIdVO(userId);
      expect(result).toBeInstanceOf(UserId);
    });

    it('should handle empty string', () => {
      const result = UserNodeMapper.toUserIdVO('');
      expect(result).toBeInstanceOf(UserId);
    });

    it('should handle UUID format', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = UserNodeMapper.toUserIdVO(uuid);
      expect(result).toBeInstanceOf(UserId);
    });
  });

  describe('toUserIdVOFromCommand', () => {
    it('should convert CreateSocialUserCommandDTO to UserId VO', () => {
      const dto: CreateSocialUserCommandDTO = {
        userId: 'user-123',
      };
      const result = UserNodeMapper.toUserIdVOFromCommand(dto);
      expect(result).toBeInstanceOf(UserId);
    });

    it('should preserve user ID value', () => {
      const userId = 'specific-user-id';
      const dto: CreateSocialUserCommandDTO = { userId };
      const result = UserNodeMapper.toUserIdVOFromCommand(dto);
      expect(result).toBeInstanceOf(UserId);
    });
  });

  describe('toUserIdVOFromQuery', () => {
    it('should convert GetSocialUserQueryDTO to UserId VO', () => {
      const dto: GetSocialUserQueryDTO = {
        userId: 'user-456',
      };
      const result = UserNodeMapper.toUserIdVOFromQuery(dto);
      expect(result).toBeInstanceOf(UserId);
    });

    it('should handle different user IDs', () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      userIds.forEach((userId) => {
        const dto: GetSocialUserQueryDTO = { userId };
        const result = UserNodeMapper.toUserIdVOFromQuery(dto);
        expect(result).toBeInstanceOf(UserId);
      });
    });
  });
});
