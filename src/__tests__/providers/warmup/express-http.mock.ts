import type { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';
import { createMock } from '../../utils/mock.helper.js';

export interface ExpressHttpMockBundle {
  request: jest.Mocked<Request>;
  response: jest.Mocked<Response>;
  next: jest.MockedFunction<NextFunction>;
}

export const createExpressHttpMockBundle = (): ExpressHttpMockBundle => {
  const request = createMock<Request>();
  const response = createMock<Response>();
  response.status.mockReturnValue(response);
  response.json.mockReturnValue(response);
  const next = createMock<{ next: NextFunction }>().next;
  return { request, response, next };
};
