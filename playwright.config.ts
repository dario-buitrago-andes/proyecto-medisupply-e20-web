import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // En CI usar más workers para paralelización, en local usar todos los cores disponibles
  workers: process.env.CI ? 2 : undefined,
  // Timeout global para cada test
  timeout: 30 * 1000, // 30 segundos
  // Timeout para expect assertions
  expect: {
    timeout: 5 * 1000, // 5 segundos
  },
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/junit.xml' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reducir timeouts de navegación
    navigationTimeout: 15 * 1000, // 15 segundos
    actionTimeout: 10 * 1000, // 10 segundos
    // Configurar para que MSW funcione en el navegador
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // En CI solo ejecutar chromium para velocidad, en local ejecutar todos
    ...(process.env.CI ? [] : [
      {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
      },
      {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
      },
    ]),
  ],
  webServer: {
    command: 'REACT_APP_E2E_TEST=true npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      REACT_APP_E2E_TEST: 'true',
    },
  },
});

