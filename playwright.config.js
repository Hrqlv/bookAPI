import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [['list', { printSteps: true }], ['html']],

  // use: {
  //   trace: 'on',
  //   video: 'on',
  //   screenshot: 'on'
  // },

  // projects: [
  //   {
  //     name: 'chrome',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },
  // ],
});

