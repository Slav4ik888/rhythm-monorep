import { test, expect, type Page } from '@playwright/test';
import { mockAuth } from '../helpers/mock-auth';

/**
 * E2E-тесты PWA на production-сборке: офлайн-режим.
 *
 * Здесь поднимается production-сборка фронтенда + `vite preview` (порт 4173, см.
 * `playwright.pwa.config.ts`). В отличие от dev-теста `e2e/guest/pwa.spec.ts`, Service
 * Worker на production-сборке генерирует прекэш всех ассетов (`sw.js`), а навигация
 * обслуживается через NetworkFirst (см. `vite.config.ts`): index.html берётся из сети,
 * кэш — только офлайн. Поэтому полный офлайн-сценарий проверяется именно здесь.
 */

/** Ждёт, пока активный Service Worker возьмёт страницу под контроль (clientsClaim + skipWaiting). */
const waitForServiceWorkerController = async (page: Page): Promise<void> => {
  await page.waitForFunction(
    () => 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
    undefined,
    { timeout: 30_000 },
  );
};

/**
 * Проверяет, что текущая (офлайн) страница обслуживается из Service Worker-кэша, а не по сети:
 * NetworkFirst-роут навигации создаёт кэш `navigations`, а JS/CSS-ассеты (precache) при выключенном
 * интернете не могут прийти по сети (transferSize === 0).
 */
const expectServedFromCache = async (page: Page): Promise<void> => {
  const state = await page.evaluate(async () => {
    const keys = await caches.keys();
    const jsCss = performance
      .getEntriesByType('resource')
      .filter((entry): entry is PerformanceResourceTiming => /\.(js|css)(\?|$)/i.test(entry.name));

    return {
      keys,
      jsCssTotal: jsCss.length,
      jsCssFromNetwork: jsCss.filter((entry) => entry.transferSize > 0).length,
    };
  });

  expect(state.keys).toEqual(expect.arrayContaining(['navigations']));
  expect(state.jsCssTotal).toBeGreaterThan(0);
  expect(state.jsCssFromNetwork).toBe(0);
};

test.describe('PWA: офлайн-режим на production-сборке', () => {
  test('Гостевая главная рендерится из SW-кэша без сети', async ({ page, context }) => {
    // 1. Первая загрузка онлайн: регистрируется Service Worker, прекэшируются ассеты.
    await page.goto('/');
    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();

    // 2. Ждём, пока SW активируется и возьмёт страницу под контроль (clientsClaim + skipWaiting).
    await waitForServiceWorkerController(page);

    // 3. Перезагрузка под контролем SW: index.html попадает в кэш навигаций (NetworkFirst),
    //    ассеты уже в precache.
    await page.reload();
    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();

    // 4. Отключаем сеть.
    await context.setOffline(true);

    // 5. Перезагрузка в офлайне — HTML/JS/CSS берутся из SW-кэша, SPA рендерится.
    await page.reload();
    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Посмотреть примеры дашбордов' })).toBeVisible();

    // 6. Контент реально обслуживается из SW-кэша, а не по сети.
    await expectServedFromCache(page);
  });

  test('Дашборд рендерится из SW-кэша без сети', async ({ page, context }) => {
    // Авторизация (владелец компании) и данные дашборда мокаются локально (page.route → fulfill),
    // поэтому не зависят от сети. При офлайне HTML/JS/CSS дашборда подтягиваются из SW-кэша.
    await mockAuth(page, {
      user: { email: 'owner@e2e.test', role: 'Owner' },
      company: { owner: 'owner@e2e.test', companyName: 'ООО «Тест»' },
    });
    await page.route('**/api/getData', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );

    // 1. Онлайн-загрузка дашборда, чтобы SW взял страницу под контроль и прекэшировал ассеты.
    await page.goto('/e2e-company-id/dashboard');
    await expect(page.getByAltText('Ритм').first()).toBeVisible();

    // 2. Ждём контролирующего SW.
    await waitForServiceWorkerController(page);

    // 3. Перезагрузка под контролем SW — index.html кэшируется (navigations), ассеты в precache.
    await page.reload();
    await expect(page.getByAltText('Ритм').first()).toBeVisible();

    // 4. Офлайн + перезагрузка — дашборд рендерится из SW-кэша.
    await context.setOffline(true);
    await page.reload();
    await expect(page).toHaveURL(/\/e2e-company-id\/dashboard$/);
    await expect(page.getByAltText('Ритм').first()).toBeVisible();

    await expectServedFromCache(page);
  });

  // Гостевые страницы рендерятся из SW-кэша. По отдельному тесту на страницу: `await` находится
  // внутри callback'а теста, а не в теле цикла, чтобы не нарушать правило no-await-in-loop.
  const guestPages = [
    { url: '/login', heading: 'Войти' },
    { url: '/signup', heading: 'Регистрация' },
    { url: '/policy', heading: 'Политика конфиденциальности' },
  ];

  for (const { url, heading } of guestPages) {
    test(`Гостевая страница ${url} рендерится из SW-кэша без сети`, async ({ page, context }) => {
      // 1. Онлайн-загрузка: SW регистрируется и прекэширует ассеты.
      await page.goto(url);
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await waitForServiceWorkerController(page);

      // 2. Повторная загрузка под контролем SW: NetworkFirst кладёт navigation в кэш `navigations`.
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

      // 3. Офлайн + перезагрузка — страница рендерится из SW-кэша.
      await context.setOffline(true);
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expectServedFromCache(page);
    });
  }

  test('Страница 404 рендерится из SW-кэша без сети', async ({ page, context }) => {
    // Многосегментный путь: один сегмент вида /non-existent-page ловится роутом :companyId.
    const notFoundText = 'Извините, запрошенная страница не найдена.';

    await page.goto('/unknown/deep/route');
    await expect(page.getByText(notFoundText)).toBeVisible();
    await waitForServiceWorkerController(page);

    await page.reload();
    await expect(page.getByText(notFoundText)).toBeVisible();

    await context.setOffline(true);
    await page.reload();
    await expect(page.getByText(notFoundText)).toBeVisible();
    await expectServedFromCache(page);
  });
});
