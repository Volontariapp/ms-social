import { jest } from '@jest/globals';
import type { AuthUser } from '@volontariapp/auth';

/**
 * Creates a type-safe mock of an object using a Proxy.
 * Every accessed property will return a jest.fn().
 *
 * @template T - The type of the object to mock.
 * @returns A jest.Mocked version of T.
 */
export const createMock = <T extends object>(): jest.Mocked<T> => {
  const target = {} as jest.Mocked<T>;

  return new Proxy(target, {
    get: (t, p): unknown => {
      if (p === 'then') {
        return undefined;
      }

      const key = p as keyof jest.Mocked<T>;

      if (!(p in t)) {
        Object.defineProperty(t, p, {
          value: jest.fn(),
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      return t[key];
    },
  });
};

/**
 * Creates a mock AuthUser for testing.
 *
 * @param overrides - Partial AuthUser to override defaults.
 * @returns An AuthUser object.
 */
export const createMockAuthUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: 'test-user-id',
  role: 'USER',
  ...overrides,
});
