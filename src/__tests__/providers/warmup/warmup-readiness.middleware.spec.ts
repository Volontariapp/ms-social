import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Neo4jWarmer } from '../../../providers/warmup/neo4j-warmer.js';
import { WarmupReadinessMiddleware } from '../../../providers/warmup/warmup-readiness.middleware.js';
import { createMock } from '../../utils/mock.helper.js';
import type { ExpressHttpMockBundle } from './express-http.mock.js';
import { createExpressHttpMockBundle } from './express-http.mock.js';

describe('WarmupReadinessMiddleware', () => {
  let warmer: jest.Mocked<Neo4jWarmer>;
  let http: ExpressHttpMockBundle;
  let middleware: WarmupReadinessMiddleware;

  beforeEach(() => {
    warmer = createMock<Neo4jWarmer>();
    http = createExpressHttpMockBundle();
    middleware = new WarmupReadinessMiddleware(warmer);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should pass the health check through when the pod is ready', () => {
    jest.spyOn(warmer, 'isReady').mockReturnValue(true);
    const statusSpy = jest.spyOn(http.response, 'status');

    middleware.use(http.request, http.response, http.next);

    expect(http.next).toHaveBeenCalledTimes(1);
    expect(statusSpy).not.toHaveBeenCalled();
  });

  it('should answer 503 without calling the health check while the warm-up runs', () => {
    jest.spyOn(warmer, 'isReady').mockReturnValue(false);
    const statusSpy = jest.spyOn(http.response, 'status');

    middleware.use(http.request, http.response, http.next);

    expect(statusSpy).toHaveBeenCalledWith(503);
    expect(http.next).not.toHaveBeenCalled();
  });
});
