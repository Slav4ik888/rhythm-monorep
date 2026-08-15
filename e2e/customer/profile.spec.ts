import { test, expect } from '@playwright/test';
import { mockAuth } from '../helpers/mock-auth';

/**
 * Smoke-тесты авторизованного пользователя (личный кабинет).
 * Авторизация мокается: GET /api/user/getAuth отдаёт пользователя-сотрудника.
 */
test.describe('Пользователь (customer): личный кабинет', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page);
  });

  test('Профиль пользователя отображает данные после авторизации', async ({ page }) => {
    await page.goto('/user-profile');

    await expect(page.getByRole('heading', { level: 1, name: 'Профиль пользователя' })).toBeVisible();
    await expect(page.getByLabel('Фамилия')).toHaveValue('Иванов');
    await expect(page.getByLabel('Имя')).toHaveValue('Иван');
    await expect(page.getByLabel('Отчество')).toHaveValue('Иванович');
    await expect(page.getByLabel('Email')).toHaveValue('employee@e2e.test');
  });

  test('Неавторизованный пользователь перенаправляется на вход', async ({ page }) => {
    // Без мока авторизации /api/user/getAuth вернёт 500 (бэкенд не поднят),
    // поэтому auth останется false и страница отправит на /login.
    await page.route('**/api/user/getAuth', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: '{}',
      }),
    );

    await page.goto('/user-profile');

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { level: 1, name: 'Войти' })).toBeVisible();
  });
});
