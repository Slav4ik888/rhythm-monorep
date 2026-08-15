# Контекст для следующей сессии

## Дата

15.08.2026 (сессия 27)

## Контекст: что сделано в этой сессии

### Этап 17: E2E-тесты (Playwright)

Создана инфраструктура сквозных E2E-тестов и первый набор smoke-тестов по трём ролям.

- Установлен `@playwright/test` (1.62.1) + браузер chromium. Скрипты `test:e2e` / `test:e2e:ui`
  в корневом `package.json`, артефакты (`test-results/`, `playwright-report/`, `blob-report/`) в `.gitignore`.
- `playwright.config.ts` (корень): 3 проекта (`guest`, `customer`, `admin`, Desktop Chrome),
  `webServer` = `npm run dev -w packages/frontend` (порт 3000), `baseURL` = `http://localhost:3000`.
- `e2e/helpers/mock-auth.ts` — фабрики `createE2eUser`/`createE2eCompany` + `mockAuth(page)`
  (перехват `**/api/user/getAuth` в формате `{ userData, companyData }`).
- `e2e/guest/pages.spec.ts` (7), `e2e/customer/profile.spec.ts` (2), `e2e/admin/dashboard.spec.ts` (2).
- `npx playwright test` — 11 passed.

Бэкенд и Firebase для E2E НЕ нужны: поднимается только Vite, авторизация мокается через `page.route()`.

### Документация

- `PLAN.md`: этап 17.
- `.clinerules/test-policy.md`: таблица E2E заполнена, итоговые цифры обновлены (507 suites / 3918 тестов).
- `README.dev.md`: добавлен раздел «E2E-тесты (Playwright)».

## Следующие шаги

1. Расширять E2E-покрытие: реальные сценарии входа/регистрации (нужны Firebase Auth-эмуляторы из
   `docker-compose.yml` + сиды), реферальная программа (партнёрские ссылки `?ref=`), офлайн/PWA.
2. Кросс-вкладочная синхронизация `viewBunchesUpdated` после IndexedDB (BroadcastChannel) — всё ещё
   открытый вопрос (см. PLAN.md 13.3 и README.dev.md).

## Коммит

`test: e2e-тесты Playwright (guest/customer/admin) + инфраструктура`

## Предупреждения/заметки

- **E2E не требуют бэкенда.** Guest-страницы спокойно переживают 500 от `getAuth`/`getPolicy`
  (обработка ошибок graceful). Для авторизованных страниц авторизация мокается через `page.route()`.
- **Роутинг:** путь из одного сегмента (`/non-existent-page`) трактуется как `:companyId` (страница
  чужой компании), НЕ как 404. Для 404 нужен многосегментный путь (`/unknown/deep/route`).
- **check-version:** `VERSION` сейчас `2.28.0` в ОБОИХ файлах (`packages/frontend/src/app/config/index.ts`,
  `packages/backend/src/app/config/index.ts`) — синхронно. `ASSEMBLY_DATE` (фронт) — «сегодня», иначе
  падает `config.test.ts`.
- **POST-эндпоинты, возвращающие данные, должны иметь `@HttpCode(200)`** (NestJS default для POST — 201).
- **`user/logout`** — `@HttpCode(302)` + `@Res()` + `reply.redirect('/')`, не убирать.
- Долгоживущие сведения (guard-мок для контроллеров, `@nestjs/testing`, PWA/SW, мёртвый код, E2E) —
  в `.clinerules/test-policy.md` и `README.dev.md`, здесь не дублировать.
