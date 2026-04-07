import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.TEST_BASE_URL || 'https://complyze.vercel.app',
    screenshot: 'on',
    trace: 'on-first-retry',
    headless: true,
  },
})
