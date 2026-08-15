import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация E2E-тестов (Playwright).
 *
 * Три проекта соответствуют ролям пользователей:
 * - guest    — неавторизованный пользователь (статичные страницы, бэкенд не требуется);
 * - customer — авторизованный пользователь (личный кабинет; авторизация мокается через page.route);
 * - admin    — владелец/админ компании (профиль компании и дашборд; авторизация мокается).
 *
 * Для авторизованных сценариев реальный бэкенд и Firebase не нужны: ответы `/api/*` подменяются
 * через page.route() (см. e2e/helpers/mock-auth.ts). Поднимается только Vite dev-сервер фронтенда.
 */
export default defineConfig({
  testDir: './e2e',
  // Офлайн-тесты PWA живут в отдельном конфиге (playwright.pwa.config.ts, production preview),
  // поэтому исключаем их из основного прогона (dev-сервер).
  testIgnore: ['**/e2e/pwa/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'guest', testDir: './e2e/guest', use: { ...devices['Desktop Chrome'] } },
    { name: 'customer', testDir: './e2e/customer', use: { ...devices['Desktop Chrome'] } },
    { name: 'admin', testDir: './e2e/admin', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev -w packages/frontend',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
