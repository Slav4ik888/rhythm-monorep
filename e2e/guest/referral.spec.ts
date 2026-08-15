import { test, expect } from '@playwright/test';

/**
 * E2E-тесты реферальной программы (партнёрские ссылки `?ref=`).
 *
 * Логика на фронте (`entities/parthner/model/hooks/use-partner`):
 * - хук `usePartner` вызывается на страницах `/demo` и `/signup`;
 * - при переходе по ссылке `?ref=<partnerId>` валидный код (см. `PARTNER_IDS`)
 *   сохраняется в localStorage (`partnerId`) и отправляется `POST /api/increaseFollower`;
 * - при регистрации сохранённый код передаётся в `POST /api/auth/signup/byEmailStart`
 *   (поле `signupData.partnerId`).
 *
 * Бэкенд не нужен: запросы `/api/*` перехватываются через page.route().
 */

const VALID_PARTNER = 'slav4ik888';

test.describe('Реферальная программа (?ref=)', () => {
  test.beforeEach(async ({ page }) => {
    // getAuth отдаёт «неавторизован» (500) — guest-страницы рендерятся без редиректа.
    await page.route('**/api/user/getAuth', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
    );
  });

  test('Переход по валидной партнёрской ссылке увеличивает счётчик', async ({ page }) => {
    const bodies: string[] = [];

    await page.route('**/api/increaseFollower', async (route) => {
      bodies.push(route.request().postData() || '');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) });
    });

    await page.goto(`/demo/?ref=${VALID_PARTNER}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();

    // Отправлен ровно один запрос с партнёрским id.
    await expect.poll(() => bodies.length).toBe(1);
    expect(JSON.parse(bodies[0])).toEqual({ partnerId: VALID_PARTNER });

    // Код сохранён в localStorage (ключ с префиксом `Rhythm-`), чтобы не учитывать повторные переходы.
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('Rhythm-partnerId')))
      .toBe(JSON.stringify(VALID_PARTNER));
  });

  test('Невалидный партнёрский код не увеличивает счётчик', async ({ page }) => {
    let calls = 0;

    await page.route('**/api/increaseFollower', async (route) => {
      calls += 1;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) });
    });

    await page.goto('/demo/?ref=unknown');
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();

    // Даём хуку время отработать (useInitialEffect) и проверяем, что вызова не было.
    await page.waitForTimeout(500);
    expect(calls).toBe(0);
    expect(await page.evaluate(() => localStorage.getItem('Rhythm-partnerId'))).toBeNull();
  });

  test('Повторный переход по партнёрской ссылке не дублирует счётчик', async ({ page }) => {
    let calls = 0;

    await page.route('**/api/increaseFollower', async (route) => {
      calls += 1;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) });
    });

    await page.goto(`/demo/?ref=${VALID_PARTNER}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();
    await expect.poll(() => calls).toBe(1);

    // Второй переход: partnerId уже в localStorage → вызова не будет.
    await page.goto(`/demo/?ref=${VALID_PARTNER}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();
    await page.waitForTimeout(500);

    expect(calls).toBe(1);
  });

  test('Партнёрский код передаётся при регистрации', async ({ page }) => {
    await page.route('**/api/increaseFollower', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok' }) }),
    );

    // Сначала проходим по партнёрской ссылке — сохраняем partnerId в localStorage.
    await page.goto(`/demo/?ref=${VALID_PARTNER}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem('Rhythm-partnerId')))
      .toBe(JSON.stringify(VALID_PARTNER));

    // Затем переходим к регистрации.
    const signupBodies: string[] = [];

    await page.route('**/api/auth/signup/byEmailStart', async (route) => {
      signupBodies.push(route.request().postData() || '');
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'ok' }) });
    });

    await page.goto('/signup');
    await page.getByLabel('Название компании').fill('ООО «Тест»');
    await page.getByLabel('Ваше имя').fill('Иван');
    await page.getByLabel('Введите email').fill('partner@e2e.test');
    await page.getByLabel('Введите пароль').fill('password123');
    await page.getByLabel('Повторите пароль').fill('password123');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Регистрация' }).click();

    await expect.poll(() => signupBodies.length).toBe(1);
    const body = JSON.parse(signupBodies[0]);
    expect(body.signupData.partnerId).toBe(VALID_PARTNER);
  });
});
