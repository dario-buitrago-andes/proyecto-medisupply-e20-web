/**
 * Setup MSW for integration tests in tests/integration
 */
import { server } from '../../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(async () => {
  await server.close();
});

