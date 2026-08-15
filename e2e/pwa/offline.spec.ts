import { test, expect } from '@playwright/test';
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

test.describe('PWA: офлайн-режим на production-сборке', () => {
  test('Гостевая главная рендерится из SW-кэша без сети', async ({ page, context }) => {
    // 1. Первая загрузка онлайн: регистрируется Service Worker, прекэшируются ассеты.
    await page.goto('/');
    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();

    // 2. Ждём, пока SW активируется и возьмёт страницу под контроль (clientsClaim + skipWaiting).
    await page.waitForFunction(
      () => 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 30_000 },
    );

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
    await page.waitForFunction(
      () => 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 30_000 },
    );

    // 3. Перезагрузка под контролем SW — index.html кэшируется (navigations), ассеты в precache.
    await page.reload();
    await expect(page.getByAltText('Ритм').first()).toBeVisible();

    // 4. Офлайн + перезагрузка — дашборд рендерится из SW-кэша.
    await context.setOffline(true);
    await page.reload();
    await expect(page).toHaveURL(/\/e2e-company-id\/dashboard$/);
    await expect(page.getByAltText('Ритм').first()).toBeVisible();
  });
});
