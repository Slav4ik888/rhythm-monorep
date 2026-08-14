# Контекст для следующей сессии

## Дата

14.08.2026 (сессия 22)

## Контекст: что сделано в этой сессии

### 1. Актуализированы таблицы API-эндпоинтов (документация)

- `README.dev.md` и `.clinerules/promt-for-dev.md`: таблицы эндпоинтов заменены с устаревших
  kebab-case без префикса на фактические NestJS-маршруты (camelCase + префикс `/api`).
- Базовый URL: `https://rhy.thm.su/api` (локально `http://localhost:7575/api`). Nginx проксирует
  `location /api/` → `127.0.0.1:7575` без срезания префикса.
- Полный список маршрутов (26 шт.) — см. `README.dev.md` → «API эндпоинты».

### 2. Удалён Koa (PLAN этап 11) — миграция на NestJS завершена

- Удалены: `src/index.ts`, `src/app/index.ts`, `src/app/types/global.d.ts`, `src/middleware/` целиком.
- Удалены Koa-контроллеры `src/controllers/*/index.ts` + подпапки (оставлены только `*.controller.ts` + `*.module.ts`).
- `src/views/`: удалены `response-error`, `get-errors`, `get-status`, `not-authorized`; оставлены
  `err-code.ts` (ERR_CODE) и `get-error-message` (getErrorMessage) — их используют модели.
- `libs/firebase/auth/`: удалены Koa-версии (`fb-auth`, `get-cookies`, `get-session-data`,
  `check-csrf-token`, `set-cookie`, `create-session`, `index.ts`); остались fastify-версии
  (`set-cookie-fastify`, `create-session-fastify`, `get-session-data-fastify`).
- `libs/loggers/`: удалены `create-log-temp` и `get-user-data-temp`; `index.ts` → `export * from './winston'`.
  `send-group-mail.ts` больше не использует `createLogTemp`.
- Удалены Koa/мёртвые модели с `Context`: `models/user/utils/get-user-id`,
  `models/company/utils/get-company-id`, `models/company/handlers/get`,
  `models/dashboard-view/services/dev-save-bunches`; обновлены `models/{user,company}/index.ts`, `handlers/index.ts`, `utils/index.ts`.
- `package.json`: убраны `dev:koa`/`start:koa` и зависимости `koa`, `koa-bodyparser`, `koa-router`,
  `@types/koa*`. Корневой `package-lock.json` обновлён (−62 пакета); удалён вложенный
  `packages/backend/package-lock.json` (npm workspace его не использует).

### 3. Дедупликация React 19 (PLAN 3.11)

- `@testing-library/react` → `^16.1.0` (установился 16.3.2).
- Root `overrides` дополнены `react: 19.0.8` / `react-dom: 19.0.8`.
- Удалён костыль `moduleNameMapper` (4 записи react/react-dom) из `packages/frontend/config/jest/jest.config.js`.
- `npm ls react react-dom` — всё на 19.0.8 (18.3.1 больше не резолвится).

### Валидация

- `npm run lint` — 0 ошибок. `npm run build -w packages/backend` — exit 0. `npm run build -w packages/frontend` — exit 0.
- backend test: 16 failed (все предсуществующие валидаторы) — новых нет.
- frontend test: 4 failed (предсуществующие валидаторы `validate-auth-by-login`, `validate-auth-by-login-schema`, `validate-fix-date-schema`, `validate-user-schema`) — новых нет.
- `VERSION` → `2.22.0`, `ASSEMBLY_DATE` → `2026-08-14`.
- Обновлён стек в `README.md`/`README.dev.md`: Koa → NestJS + Fastify, PM2 → systemd,
  структура бэкенда (guards/interceptors/main.ts), Zustand + TanStack Query (было Redux Toolkit).

## Следующие шаги

1. **Почистить скомпилированный `packages/backend/server/` от старых Koa-файлов.** `tsc` не удаляет
   файлы из `outDir`, поэтому `server/app/index.js`, `server/controllers/*/index.js` (Koa) остались.
   Они безвредны (старт — `server/main.js`), но лучше почистить: `rm -rf packages/backend/server && npm run build -w packages/backend`.
   Подумать, не добавить ли очистку `server/` в `deploy.sh`/build-скрипт.
2. (опц., сервер) почистить `/etc/rhythm/rhythm-server.env` от неиспользуемых
   `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` — нужны только как fallback для локального dev
   (в проде работает `GOOGLE_APPLICATION_CREDENTIALS`).
3. Продолжить покрытие тестами по приоритетам `test-policy.md` (Auth, Company, Dashboard — integration-тестов всё ещё нет).
4. Этап 2 (v2.0): оплата/эквайринг, обработка webhook.

## Коммит

`refactor: удалён Koa (переход на NestJS завершён), дедуплицирован React 19, актуализированы таблицы эндпоинтов`

## Предупреждения/заметки

- Вложенный `packages/frontend/package-lock.json` остался (артефакт до монорепо, не содержит koa) —
  при желании можно тоже удалить, как и backend-вариант.
- React 19 теперь принудительно через `overrides`: если какой-то пакет обновится до строгого peer
  `^18`, `npm install` даст peer-предупреждение (не ERESOLVE — overrides принудительны). Держать в уме.
- `get-session-data-fastify.ts` — fastify-версия, пока нигде не используется (FirebaseAuthGuard
  реализует свою `extractSessionCookie`); оставлена «на будущее», можно удалить при чистке.
- `loggerServer`/`loggerApp` после удаления Koa не используются в коде (остались в `winston/index.ts`),
  но не мешают — просто набор логгеров.
