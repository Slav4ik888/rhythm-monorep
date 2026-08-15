import { test, expect } from '@playwright/test';
import { createE2eUser, createE2eCompany } from '../helpers/mock-auth';

/**
 * E2E-тесты сценариев входа и регистрации (фронтенд-флоу).
 *
 * Аутентификация на фронте делегирована бэкенду:
 * - вход — `POST /api/auth/login/byEmail`;
 * - регистрация — `POST /api/auth/signup/byEmailStart` (отправка кода) →
 *   `POST /api/auth/signup/byEmailEnd` (подтверждение кода);
 * - сброс пароля — `POST /api/auth/login/resetEmailPassword`.
 *
 * Здесь ответы `/api/*` мокаются через page.route(), поэтому реальный бэкенд и
 * Firebase Auth-эмуляторы не нужны. Тесты покрывают полный UI-флоу: валидацию,
 * отправку запросов и редиректы после успешного входа/регистрации.
 */

test.describe('Сценарии входа и регистрации', () => {
  test.beforeEach(async ({ page }) => {
    // getAuth отдаёт «неавторизован» (500) — страницы login/signup рендерятся.
    await page.route('**/api/user/getAuth', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
    );
  });

  test('Вход: успешный сценарий перенаправляет на главную', async ({ page }) => {
    const loginBodies: string[] = [];

    await page.route('**/api/auth/login/byEmail', async (route) => {
      loginBodies.push(route.request().postData() || '');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: createE2eUser(),
          company: createE2eCompany(),
          message: 'ok',
        }),
      });
    });

    await page.goto('/login');
    await page.getByLabel('Введите email').fill('employee@e2e.test');
    await page.getByLabel('Введите пароль').fill('password123');
    await page.getByRole('button', { name: 'Войти' }).click();

    // Отправлен запрос входа с email в нижнем регистре и паролем.
    await expect.poll(() => loginBodies.length).toBe(1);
    const body = JSON.parse(loginBodies[0]);
    expect(body.authByLogin).toEqual({ email: 'employee@e2e.test', password: 'password123' });

    // После установки auth страница перенаправляется на главную.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/Ритм компании/)).toBeVisible();
  });

  test('Вход: пустая форма не отправляет запрос и показывает ошибки', async ({ page }) => {
    let calls = 0;

    await page.route('**/api/auth/login/byEmail', async (route) => {
      calls += 1;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });

    await page.goto('/login');
    await page.getByRole('button', { name: 'Войти' }).click();

    // Валидация не пропускает пустые поля — запрос не отправлен, остаёмся на /login.
    await page.waitForTimeout(300);
    expect(calls).toBe(0);
    await expect(page).toHaveURL(/\/login/);
  });

  test('Восстановление пароля: отправка email', async ({ page }) => {
    const resetBodies: string[] = [];

    await page.route('**/api/auth/login/resetEmailPassword', async (route) => {
      resetBodies.push(route.request().postData() || '');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok' }) });
    });

    await page.goto('/login');
    await page.getByText('Восстановить пароль').click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Восстановление пароля')).toBeVisible();
    await dialog.getByLabel('Введите email').fill('employee@e2e.test');
    await dialog.getByRole('button', { name: 'Отправить' }).click();

    await expect.poll(() => resetBodies.length).toBe(1);
    expect(JSON.parse(resetBodies[0])).toEqual({ email: 'employee@e2e.test' });
  });

  test('Регистрация: полный сценарий до перенаправления на главную', async ({ page }) => {
    const startBodies: string[] = [];
    const endBodies: string[] = [];

    await page.route('**/api/auth/signup/byEmailStart', async (route) => {
      startBodies.push(route.request().postData() || '');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok' }) });
    });

    await page.route('**/api/auth/signup/byEmailEnd', async (route) => {
      endBodies.push(route.request().postData() || '');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          newUserData: createE2eUser(),
          newCompanyData: createE2eCompany(),
          message: 'ok',
        }),
      });
    });

    await page.goto('/signup');
    await page.getByLabel('Название компании').fill('ООО «Тест»');
    await page.getByLabel('Ваше имя').fill('Иван');
    await page.getByLabel('Введите email').fill('new@e2e.test');
    await page.getByLabel('Введите пароль').fill('password123');
    await page.getByLabel('Повторите пароль').fill('password123');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Регистрация' }).click();

    // Шаг 1: отправлен код подтверждения.
    await expect.poll(() => startBodies.length).toBe(1);
    const startBody = JSON.parse(startBodies[0]);
    expect(startBody.signupData.email).toBe('new@e2e.test');
    expect(startBody.signupData.permissions).toBe(true);

    // Показывается форма ввода кода.
    await expect(page.getByText('Введите код подтверждения отправленный на указанную Вами почту')).toBeVisible();

    // Шаг 2: подтверждение кода завершает регистрацию.
    await page.locator('input[name="emailCode"]').fill('123456');
    await page.getByRole('button', { name: 'Подтвердить' }).click();

    await expect.poll(() => endBodies.length).toBe(1);
    expect(JSON.parse(endBodies[0])).toEqual({ signupDataEnd: { email: 'new@e2e.test', emailCode: '123456' } });

    // После регистрации auth=true → перенаправление на главную.
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/Ритм компании/)).toBeVisible();
  });
});
