/**
 * Setup MSW for integration tests
 * This file should be imported in integration test files
 */
import { server } from '../mocks/server';

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that are declared as a part of our tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(async () => {
  await server.close();
});

