/**
 * MSW server setup for Node.js environment (tests)
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Ensure server is properly closed on process exit
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

