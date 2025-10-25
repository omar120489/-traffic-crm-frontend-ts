import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';
import path from 'path';

// Determine mode (development, staging, production)
const mode = process.env.VITE_MODE || 'development';

// Load environment variables using Vite's exact logic
// The third argument '' loads all variables, not just those with VITE_ prefix.
const env = loadEnv(mode, path.resolve(__dirname), '');

// Assign to process.env for Playwright access
Object.assign(process.env, env);

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  
  use: {
    // Use the Vite-loaded variable, providing a fallback
    baseURL: process.env.E2E_BASE_URL || env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    // Enable later for cross-browser testing:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  
  webServer: {
    command: 'pnpm run dev',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI, // use dev server if it's already running locally
  }
});
