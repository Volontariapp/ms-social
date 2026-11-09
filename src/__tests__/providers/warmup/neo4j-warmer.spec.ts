import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@volontariapp/logger';
import {
  NEO4J_WARMUP_CONNECTIONS,
  NEO4J_WARMUP_INTERVAL_MS,
  NEO4J_WARMUP_STARTUP_BUDGET_MS,
  Neo4jWarmer,
} from '../../../providers/warmup/neo4j-warmer.js';
import { WARMUP_BATCH_SIZES } from '../../../providers/warmup/neo4j-warmup.queries.js';
import type { Neo4jProviderMockBundle } from '../database/neo4j-provider.mock.js';
import { createNeo4jProviderMockBundle } from '../database/neo4j-provider.mock.js';
import type { Neo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';
import { createNeo4jWarmupServicesMockBundle } from './neo4j-warmup-services.mock.js';

const HOT_QUERIES = 15 + 2 * WARMUP_BATCH_SIZES.length + 1;

const createWarmer = (
  neo4j: Neo4jProviderMockBundle,
  services: Neo4jWarmupServicesMockBundle,
): Neo4jWarmer =>
  new Neo4jWarmer(
    neo4j.provider,
    services.participation,
    services.relationship,
    services.eventPostLink,
  );

describe('Neo4jWarmer', () => {
  let neo4j: Neo4jProviderMockBundle;
  let services: Neo4jWarmupServicesMockBundle;
  let warmer: Neo4jWarmer;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'info').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});
    neo4j = createNeo4jProviderMockBundle(true);
    services = createNeo4jWarmupServicesMockBundle();
    warmer = createWarmer(neo4j, services);
  });

  afterEach(() => {
    warmer.onApplicationShutdown();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should replay the hot reads and open the pooled connections in one round', async () => {
    const runSpy = jest.spyOn(neo4j.session, 'run');
    const closeSpy = jest.spyOn(neo4j.session, 'close');

    const report = await warmer.warm();

    expect(report.failures).toBe(0);
    expect(report.queries).toBe(HOT_QUERIES + NEO4J_WARMUP_CONNECTIONS);
    expect(runSpy).toHaveBeenCalledTimes(NEO4J_WARMUP_CONNECTIONS);
    expect(runSpy).toHaveBeenCalledWith('RETURN 1');
    expect(closeSpy).toHaveBeenCalledTimes(NEO4J_WARMUP_CONNECTIONS);
  });

  it('should count failures without throwing and log a warning', async () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest
      .spyOn(services.relationship, 'isFollowing')
      .mockRejectedValueOnce(new Error('Neo4j unavailable'));

    const report = await warmer.warm();

    expect(report.failures).toBe(1);
    expect(warnSpy).toHaveBeenCalledWith('Neo4j warm-up had failures', { failures: 1 });
  });

  it('should skip the round when Neo4j is not connected', async () => {
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    const disconnected = createNeo4jProviderMockBundle(false);
    const idleWarmer = createWarmer(disconnected, services);
    const exclusionsSpy = jest.spyOn(services.participation, 'getSearchExclusions');
    const getDriverSpy = jest.spyOn(disconnected.provider, 'getDriver');

    const report = await idleWarmer.warm();

    expect(report.queries).toBe(0);
    expect(exclusionsSpy).not.toHaveBeenCalled();
    expect(getDriverSpy).not.toHaveBeenCalled();
  });

  it('should share a round in progress instead of starting a second one', async () => {
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');

    const [first, second] = await Promise.all([warmer.warm(), warmer.warm()]);

    expect(second).toBe(first);
    expect(followSpy).toHaveBeenCalledTimes(1);
  });

  it('should warm at bootstrap, only once, then every interval', async () => {
    jest.useFakeTimers();
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');

    await warmer.onApplicationBootstrap();
    await warmer.onApplicationBootstrap();
    expect(followSpy).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(NEO4J_WARMUP_INTERVAL_MS);
    expect(followSpy).toHaveBeenCalledTimes(2);
  });

  it('should stop the periodic round at shutdown', async () => {
    jest.useFakeTimers();
    const followSpy = jest.spyOn(services.relationship, 'isFollowing');

    await warmer.onApplicationBootstrap();
    warmer.onApplicationShutdown();
    await jest.advanceTimersByTimeAsync(NEO4J_WARMUP_INTERVAL_MS * 2);

    expect(followSpy).toHaveBeenCalledTimes(1);
  });

  it('should not hold the bootstrap past the startup budget when Neo4j hangs', async () => {
    jest.useFakeTimers();
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    jest
      .spyOn(services.participation, 'getSearchExclusions')
      .mockReturnValue(new Promise(() => {}));

    const bootstrap = warmer.onApplicationBootstrap();
    await jest.advanceTimersByTimeAsync(NEO4J_WARMUP_STARTUP_BUDGET_MS);
    await bootstrap;

    expect(warnSpy).toHaveBeenCalledWith(
      'Neo4j warm-up still running after the startup budget, serving anyway',
      { budgetMs: NEO4J_WARMUP_STARTUP_BUDGET_MS },
    );
  });
});
