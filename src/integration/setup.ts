/**
 * Setup MSW for integration tests
 * This file should be imported in integration test files
 */
import { server } from '../mocks/server';

// Establish API mocking before all tests
// Use 'warn' instead of 'error' to allow tests that hit real endpoints (like Postman mock)
// This allows tests to work with both MSW mocks and real API endpoints
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset any request handlers that are declared as a part of our tests
afterEach(() => {
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(async () => {
  await server.close();
});

