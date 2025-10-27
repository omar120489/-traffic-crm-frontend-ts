import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mode = process.env.VITE_MODE || 'development';
const env = loadEnv(mode, path.resolve(__dirname), '');

Object.assign(process.env, env);

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
    // Add firefox/webkit projects when cross-browser coverage is ready.
  ],
  webServer: {
    // Use a shell wrapper to suppress Vite output
    command: 'sh -c "exec 3>&1 4>&2; exec 1>/dev/null 2>&1; pnpm run dev; exec 1>&3 2>&4"',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
