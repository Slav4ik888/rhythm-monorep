import { test, expect } from '@playwright/test';
import { mockAuth } from '../helpers/mock-auth';

/**
 * Smoke-тесты владельца компании (админ): профиль компании и дашборд.
 * Авторизация мокается: владелец (owner) имеет полный доступ к компании.
 */
test.describe('Админ (владелец): управление компанией и дашборд', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuth(page, {
      user: { email: 'owner@e2e.test', role: 'Owner' },
      company: { owner: 'owner@e2e.test', companyName: 'ООО «Тест»' },
    });

    // Данные Google-таблицы для дашборда: пустой ответ, чтобы не падал transform.
    await page.route('**/api/getData', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      }),
    );
  });

  test('Профиль компании доступен владельцу', async ({ page }) => {
    await page.goto('/company-profile');

    await expect(page.getByRole('heading', { level: 1, name: 'Профиль компании' })).toBeVisible();
    await expect(page.getByLabel('Название компании')).toHaveValue('ООО «Тест»');
    await expect(page.getByLabel('Владелец аккаунта')).toHaveValue('owner@e2e.test');
  });

  test('Дашборд компании отображается владельцу без редиректа', async ({ page }) => {
    await page.goto('/e2e-company-id/dashboard');

    // Не редиректим на /login — авторизация и проверка доступа прошли.
    await expect(page).toHaveURL(/\/e2e-company-id\/dashboard$/);
    // Сайдбар рендерится только внутри дашборда (после проверки доступа).
    await expect(page.getByAltText('Ритм').first()).toBeVisible();
    // Страница не должна показывать 404.
    await expect(page.getByText('Извините, запрошенная страница не найдена.')).toBeHidden();
  });
});
