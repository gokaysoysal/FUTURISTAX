import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    // Site birincil dili Türkçe (`/`). next-intl localeDetection, tarayıcı
    // dili İngilizce olduğunda `/` → `/en` yönlendirir; testler Türkçe siteyi
    // doğruladığı için tarayıcı dilini tr-TR sabitliyoruz.
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
