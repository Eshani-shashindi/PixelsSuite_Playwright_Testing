import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : 2,

  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"]
  ],

  use: {
    baseURL: "https://www.pixelssuite.com",
    trace: "off",
    screenshot: "on",
    video: "off",
    actionTimeout: 30000,
    navigationTimeout: 60000,

    headless: process.env.CI ? true : false,

    launchOptions: {
      slowMo: process.env.CI ? 0 : 200,
    },
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],

  outputDir: "test-results/",
});