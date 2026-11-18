import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    [
      'html',
      { outputFolder: '../../.agent-local/playwright/report', open: 'never' },
    ],
  ],
  outputDir: '../../.agent-local/playwright/results',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    locale: 'ko-KR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { SITE_URL: 'http://127.0.0.1:3000' },
  },
});
