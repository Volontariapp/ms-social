import { jest } from '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { InteractionQueryController } from '../../../modules/interaction/controllers/interaction.query.controller.js';
import { InteractionService, PostLikeSummaryVO } from '@volontariapp/domain-social';
import { GetPostsLikeSummaryQueryDTO } from '../../../modules/interaction/dto/interaction.query.dto.js';
import { createMock, createMockAuthUser } from '../../utils/mock.helper.js';

describe('InteractionQueryController', () => {
  let controller: InteractionQueryController;
  let service: jest.Mocked<InteractionService>;
  const mockUser = createMockAuthUser();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteractionQueryController],
      providers: [
        {
          provide: InteractionService,
          useValue: createMock<InteractionService>(),
        },
      ],
    }).compile();

    controller = module.get<InteractionQueryController>(InteractionQueryController);
    service = module.get(InteractionService);
  });

  describe('getPostsLikeSummary', () => {
    // Test nominal: verification de l appel au service avec les bons identifiants et du mapping de reponse
    it('should call service with user and post ids and return mapped summaries', async () => {
      const mockSummaries = [
        new PostLikeSummaryVO('post-1', 12, true),
        new PostLikeSummaryVO('post-2', 0, false),
      ];
      const spy = jest.spyOn(service, 'getPostsLikeSummary').mockResolvedValue(mockSummaries);

      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: ['post-1', 'post-2'],
      });

      const result = await controller.getPostsLikeSummary(dto, mockUser);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: mockUser.id }), [
        expect.objectContaining({ value: 'post-1' }),
        expect.objectContaining({ value: 'post-2' }),
      ]);
      expect(result.summaries).toEqual([
        { postId: 'post-1', likeCount: 12, likedByMe: true },
        { postId: 'post-2', likeCount: 0, likedByMe: false },
      ]);
    });

    // Test avec liste vide
    it('should return empty summaries when post ids list is empty', async () => {
      const spy = jest.spyOn(service, 'getPostsLikeSummary').mockResolvedValue([]);

      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: [],
      });

      const result = await controller.getPostsLikeSummary(dto, mockUser);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ value: mockUser.id }), []);
      expect(result.summaries).toEqual([]);
    });
  });

  describe('GetPostsLikeSummaryQueryDTO', () => {
    it('should validate with valid postIds', async () => {
      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: ['post-1', 'post-2'],
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should validate with empty array', async () => {
      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: [],
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when exceeding ceiling of 100', async () => {
      const postIds = Array.from({ length: 101 }, (_, i) => `post-${String(i)}`);
      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds,
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'postIds')).toBe(true);
    });

    it('should fail validation when duplicate postIds are provided', async () => {
      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: ['post-1', 'post-1'],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'postIds')).toBe(true);
    });

    it('should fail validation when element is not a string', async () => {
      const dto = plainToInstance(GetPostsLikeSummaryQueryDTO, {
        postIds: [123],
      });
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((error) => error.property === 'postIds')).toBe(true);
    });
  });
});
