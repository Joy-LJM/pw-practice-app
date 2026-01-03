import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

export default defineConfig({
  // Timeout for each test in milliseconds. Defaults to 30 seconds.
  // timeout:10000,
  // Configuration for the expect assertion timeouts.
  expect: {
    timeout: 5000,
  },
  // Maximum time in milliseconds the whole test suite can run
  globalTimeout: 60000,
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:4200/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    // Default timeout for each Playwright action:click... in milliseconds, defaults to 0
    // actionTimeout:3000,
    // Default timeout for navigating to a page in milliseconds, defaults to 0
    // navigationTimeout:1000,
    // video:'retain-on-failure'
    // should run npm run usePageObject-chrome command to view the video
    video: {
      mode: "off",
      size: {
        width: 1920,
        height: 1080,
      },
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "dev",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4200/",
      },
    },
    {
      name: "staging",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:4201/",
      },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: {
        browserName: "firefox",
        // override global settings
        video: {
          mode: "retain-on-failure",
        },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 12"],
      },
    },
  ],
});
