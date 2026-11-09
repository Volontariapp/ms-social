import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { Logger } from '@volontariapp/logger';
import {
  NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS,
  NEO4J_MAX_CONNECTION_POOL_SIZE,
  buildNeo4jDriverConfig,
  logNeo4jDriverMessage,
} from '../../../providers/database/neo4j-driver.config.js';

describe('buildNeo4jDriverConfig', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should bound the pool, fail acquisition before the gateway deadline and check idle connections', () => {
    const config = buildNeo4jDriverConfig();

    expect(config.maxConnectionPoolSize).toBe(NEO4J_MAX_CONNECTION_POOL_SIZE);
    expect(config.connectionAcquisitionTimeout).toBe(NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS);
    expect(NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS).toBeLessThan(2_000);
    expect(config.connectionLivenessCheckTimeout).toBeGreaterThan(0);
    expect(config.maxConnectionLifetime).toBeGreaterThan(60 * 60 * 1000);
    expect(config.logging?.level).toBe('warn');
  });

  it('should forward driver errors and warnings to the matching logger level', () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    const debugSpy = jest.spyOn(Logger.prototype, 'debug').mockImplementation(() => {});

    logNeo4jDriverMessage('error', 'connection lost');
    logNeo4jDriverMessage('warn', 'acquisition slow');
    logNeo4jDriverMessage('info', 'routing table updated');

    expect(errorSpy).toHaveBeenCalledWith('connection lost');
    expect(warnSpy).toHaveBeenCalledWith('acquisition slow');
    expect(debugSpy).toHaveBeenCalledWith('routing table updated');
  });
});
