import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@volontariapp/logger';
import {
  NEO4J_HEALTH_POLL_INTERVAL_MS,
  NEO4J_RECOVERY_READINESS_CAP_MS,
  Neo4jWarmer,
} from '../../../providers/warmup/neo4j-warmer.js';
import type { Neo4jProviderMockBundle } from '../database/neo4j-provider.mock.js';
import { createNeo4jProviderMockBundle } from '../database/neo4j-provider.mock.js';
import type { Neo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';
import { createNeo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';

describe('Neo4jWarmer, Neo4j restart', () => {
  let neo4j: Neo4jProviderMockBundle;
  let services: Neo4jWarmupServicesMockBundle;
  let warmer: Neo4jWarmer;
  let infoSpy: jest.SpiedFunction<Logger['info']>;

  beforeEach(() => {
    jest.useFakeTimers();
    infoSpy = jest.spyOn(Logger.prototype, 'info').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    neo4j = createNeo4jProviderMockBundle(true);
    services = createNeo4jWarmupServicesMockBundle();
    warmer = new Neo4jWarmer(
      neo4j.provider,
      services.participation,
      services.relationship,
      services.eventPostLink,
    );
  });

  afterEach(() => {
    warmer.onApplicationShutdown();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should run one warm-up when Neo4j goes down then up, and log it at info', async () => {
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');
    jest
      .spyOn(neo4j.driver, 'verifyConnectivity')
      .mockRejectedValueOnce(new Error('connection refused'))
      .mockRejectedValueOnce(new Error('connection refused'));

    await warmer.probeNeo4j();
    await warmer.probeNeo4j();
    expect(followSpy).not.toHaveBeenCalled();

    await warmer.probeNeo4j();
    await warmer.probeNeo4j();
    await jest.advanceTimersByTimeAsync(0);

    expect(followSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy).toHaveBeenCalledWith(
      'Neo4j back, warm-up done',
      expect.objectContaining({ durationMs: expect.any(Number) }),
    );
  });

  it('should not warm up when Neo4j stays up', async () => {
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');

    await warmer.probeNeo4j();
    await warmer.probeNeo4j();

    expect(followSpy).not.toHaveBeenCalled();
    expect(warmer.isReady()).toBe(true);
  });

  it('should report not ready during the recovery warm-up, and ready once it is done', async () => {
    let finishWarmup: (value: boolean) => void = () => {};
    jest.spyOn(services.relationship, 'isFollowing').mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finishWarmup = resolve;
      }),
    );
    jest
      .spyOn(neo4j.driver, 'verifyConnectivity')
      .mockRejectedValueOnce(new Error('connection refused'));

    await warmer.probeNeo4j();
    await warmer.probeNeo4j();
    await jest.advanceTimersByTimeAsync(0);
    expect(warmer.isReady()).toBe(false);

    finishWarmup(false);
    await jest.advanceTimersByTimeAsync(0);
    expect(warmer.isReady()).toBe(true);
  });

  it('should be ready again after the cap even if the warm-up never ends', async () => {
    jest.spyOn(services.relationship, 'isFollowing').mockReturnValue(new Promise(() => {}));
    jest
      .spyOn(neo4j.driver, 'verifyConnectivity')
      .mockRejectedValueOnce(new Error('connection refused'));

    await warmer.probeNeo4j();
    await warmer.probeNeo4j();
    await jest.advanceTimersByTimeAsync(NEO4J_RECOVERY_READINESS_CAP_MS - 1);
    expect(warmer.isReady()).toBe(false);

    await jest.advanceTimersByTimeAsync(1);
    expect(warmer.isReady()).toBe(true);
  });

  it('should probe Neo4j on its own interval once bootstrapped', async () => {
    const verifySpy = jest.spyOn(neo4j.driver, 'verifyConnectivity');
    await warmer.onApplicationBootstrap();
    verifySpy.mockClear();

    await jest.advanceTimersByTimeAsync(NEO4J_HEALTH_POLL_INTERVAL_MS * 3);

    expect(verifySpy).toHaveBeenCalledTimes(3);
  });
});
