import { test, expect } from '@playwright/test';

/**
 * Smoke-тесты гостя: статические страницы, доступные без авторизации.
 * Бэкенд не требуется — запрос /api/user/getAuth на старте падает gracefully,
 * и приложение рендерит гостевые страницы.
 */
test.describe('Гость: статические страницы', () => {
  test('Главная отображает приветствие и кнопку перехода к демо', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Настрой «Ритм» своей компании!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Посмотреть примеры дашбордов' })).toBeVisible();
  });

  test('Страница входа отображает форму', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { level: 1, name: 'Войти' })).toBeVisible();
    await expect(page.getByLabel('Введите email')).toBeVisible();
    await expect(page.getByLabel('Введите пароль')).toBeVisible();
  });

  test('Страница регистрации отображает форму', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('heading', { level: 1, name: 'Регистрация' })).toBeVisible();
    await expect(page.getByLabel('Название компании')).toBeVisible();
    await expect(page.getByLabel('Ваше имя')).toBeVisible();
    await expect(page.getByLabel('Введите email')).toBeVisible();
    await expect(page.getByLabel('Введите пароль')).toBeVisible();
    await expect(page.getByLabel('Повторите пароль')).toBeVisible();
  });

  test('Страница политики отображает заголовок', async ({ page }) => {
    await page.goto('/policy');

    await expect(page.getByRole('heading', { level: 1, name: 'Политика конфиденциальности' })).toBeVisible();
  });

  test('Демо-страницы отображают список примеров', async ({ page }) => {
    await page.goto('/demo');

    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();
    await expect(page.getByText('Яркая панель')).toBeVisible();
    await expect(page.getByText('Светлосерая панель')).toBeVisible();
  });

  test('Неизвестный маршрут отображает 404', async ({ page }) => {
    // Одним сегментом вида /non-existent-page не подойдёт: он трактуется как :companyId
    // (страница чужой компании). Для 404 нужен маршрут, который не ловится ни одним роутом.
    await page.goto('/unknown/deep/route');

    await expect(page.getByText('Извините, запрошенная страница не найдена.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Перейти на главную' })).toBeVisible();
  });

  test('Переход на демо-страницы с главной', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Посмотреть примеры дашбордов' }).click();

    await expect(page).toHaveURL(/\/demo/);
    await expect(page.getByRole('heading', { level: 1, name: 'Демо-страницы' })).toBeVisible();
  });
});
