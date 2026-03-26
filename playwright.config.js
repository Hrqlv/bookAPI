import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [['list', { printSteps: true }], ['html']],
});

