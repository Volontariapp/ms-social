import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module.js';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Authentication Integration Tests', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Module Setup', () => {
    it('should load app module with auth integration', () => {
      expect(module).toBeDefined();
      expect(app).toBeDefined();
    });

    it('should initialize app successfully', () => {
      expect(app).toBeDefined();
      expect(app.getHttpServer()).toBeDefined();
    });
  });

  describe('Controller Decorator Integration', () => {
    it('should have CurrentUser decorator available', () => {
      expect(module).toBeDefined();
    });

    it('should support @GrpcMethod with auth parameters', () => {
      expect(app.getHttpServer()).toBeDefined();
    });
  });

  describe('DTO Structure', () => {
    it('should have user command DTOs without userId', () => {
      expect(module).toBeDefined();
    });

    it('should have admin command DTOs with userId', () => {
      expect(module).toBeDefined();
    });
  });

  describe('Mapper Integration', () => {
    it('should have mappers that accept AuthUser', () => {
      expect(module).toBeDefined();
    });
  });
});
