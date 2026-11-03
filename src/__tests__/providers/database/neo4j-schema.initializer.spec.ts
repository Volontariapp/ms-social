import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { NEST_NEO4J_PROVIDER } from '@volontariapp/bridge-nest';
import { Logger } from '@volontariapp/logger';
import {
  NEO4J_UNIQUE_CONSTRAINTS,
  Neo4jSchemaInitializer,
} from '../../../providers/database/neo4j-schema.initializer.js';
import type { Neo4jProviderMockBundle } from './neo4j-provider.mock.js';
import { createNeo4jProviderMockBundle } from './neo4j-provider.mock.js';

describe('Neo4jSchemaInitializer', () => {
  let mockBundle: Neo4jProviderMockBundle;
  let initializer: Neo4jSchemaInitializer;

  beforeEach(async () => {
    mockBundle = createNeo4jProviderMockBundle(true);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Neo4jSchemaInitializer,
        {
          provide: NEST_NEO4J_PROVIDER,
          useValue: mockBundle.provider,
        },
      ],
    }).compile();

    initializer = module.get<Neo4jSchemaInitializer>(Neo4jSchemaInitializer);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined when resolved from testing module', () => {
    expect(initializer).toBeDefined();
  });

  it('should execute the three unique constraint queries in order when connected', async () => {
    const runSpy = jest.spyOn(mockBundle.session, 'run');
    const closeSpy = jest.spyOn(mockBundle.session, 'close');

    await initializer.onApplicationBootstrap();

    expect(runSpy).toHaveBeenCalledTimes(3);
    expect(runSpy).toHaveBeenNthCalledWith(1, NEO4J_UNIQUE_CONSTRAINTS[0]);
    expect(runSpy).toHaveBeenNthCalledWith(2, NEO4J_UNIQUE_CONSTRAINTS[1]);
    expect(runSpy).toHaveBeenNthCalledWith(3, NEO4J_UNIQUE_CONSTRAINTS[2]);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should close session even when a query throws an error', async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    const closeSpy = jest.spyOn(mockBundle.session, 'close');
    jest
      .spyOn(mockBundle.session, 'run')
      .mockRejectedValueOnce(new Error('Cypher execution failed'));

    await initializer.onApplicationBootstrap();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not crash and should log error when a query fails', async () => {
    const failureError = new Error('Constraint violation detected');
    const loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(mockBundle.session, 'run').mockRejectedValueOnce(failureError);

    await expect(initializer.onApplicationBootstrap()).resolves.toBeUndefined();

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Failed to create Neo4j constraint: ${NEO4J_UNIQUE_CONSTRAINTS[0]}`,
      failureError,
    );
  });

  it('should not execute any query or open session when provider is not connected', async () => {
    const disconnectedBundle = createNeo4jProviderMockBundle(false);
    const disconnectedInitializer = new Neo4jSchemaInitializer(disconnectedBundle.provider);
    const loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});

    const getDriverSpy = jest.spyOn(disconnectedBundle.provider, 'getDriver');
    const runSpy = jest.spyOn(disconnectedBundle.session, 'run');
    const closeSpy = jest.spyOn(disconnectedBundle.session, 'close');

    await disconnectedInitializer.onApplicationBootstrap();

    expect(getDriverSpy).not.toHaveBeenCalled();
    expect(runSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    expect(loggerWarnSpy).toHaveBeenCalledTimes(1);
  });
});
