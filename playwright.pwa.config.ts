import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация E2E-тестов PWA на production-сборке (офлайн-режим).
 *
 * В отличие от основного `playwright.config.ts` (dev-сервер Vite, порт 3000), здесь
 * поднимается production-сборка фронтенда (`npm run build -w packages/frontend`) и
 * раздаётся через `vite preview` (порт 4173). Только в production-сборке Service Worker
 * генерирует корректный прекэш ассетов (dev-режим обслуживает HMR и dev-assets), поэтому
 * офлайн-сценарий проверяется именно здесь.
 *
 * Запуск: npm run test:e2e:pwa
 */
export default defineConfig({
  testDir: './e2e/pwa',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'pwa', testDir: './e2e/pwa', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build -w packages/frontend && npm run preview -w packages/frontend -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
