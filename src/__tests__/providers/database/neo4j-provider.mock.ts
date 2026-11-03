import type { jest } from '@jest/globals';
import type { NestNeo4jProvider } from '@volontariapp/bridge-nest';
import type { Driver, Session } from 'neo4j-driver';
import { createMock } from '../../utils/mock.helper.js';

export interface Neo4jProviderMockBundle {
  provider: jest.Mocked<NestNeo4jProvider>;
  driver: jest.Mocked<Driver>;
  session: jest.Mocked<Session>;
}

export const createNeo4jProviderMockBundle = (isConnected = true): Neo4jProviderMockBundle => {
  const session = createMock<Session>();
  session.close.mockResolvedValue(undefined);

  const driver = createMock<Driver>();
  driver.session.mockReturnValue(session);

  const provider = createMock<NestNeo4jProvider>();
  provider.isConnected.mockReturnValue(isConnected);
  provider.getDriver.mockReturnValue(driver);

  return {
    provider,
    driver,
    session,
  };
};
