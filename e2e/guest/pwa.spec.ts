import { test, expect } from '@playwright/test';

/**
 * E2E-тесты PWA: веб-манифест и регистрация Service Worker.
 *
 * PWA настроен через vite-plugin-pwa (packages/frontend/vite.config.ts):
 * - manifest.webmanifest раздаётся dev-сервером (devOptions.enabled: true);
 * - регистрируется dev-сборка Service Worker (registerSW.js → /dev-sw.js).
 *
 * Полный офлайн-сценарий (работа из кэша без сети) покрывается отдельно на
 * production-сборке — в dev-режиме SW обслуживает HMR и dev-assets.
 */

test.describe('PWA: манифест и Service Worker', () => {
  test('Веб-манифест отдаётся с корректными полями', async ({ page, request }) => {
    await page.goto('/');

    const res = await request.get('/manifest.webmanifest');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('json');

    const manifest = await res.json();
    expect(manifest.name).toContain('Ритм');
    expect(manifest.short_name).toBe('Ритм');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('Ссылка на манифест присутствует в HTML', async ({ page }) => {
    await page.goto('/');

    const href = await page.getAttribute('link[rel="manifest"]', 'href');
    expect(href).toBe('/manifest.webmanifest');
  });

  test('Service Worker регистрируется после загрузки', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();

    // Регистрация происходит асинхронно после загрузки приложения.
    await expect
      .poll(
        () =>
          page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return 0;
            const regs = await navigator.serviceWorker.getRegistrations();
            return regs.length;
          }),
        { timeout: 15_000 },
      )
      .toBeGreaterThan(0);
  });
});
