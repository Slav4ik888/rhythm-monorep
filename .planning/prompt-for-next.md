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

### 4. Восстановлен механизм проверки версии (check-version)

- Проблема: при удалении Koa-middleware `check-version` (этап 11) он не был мигрирован в NestJS (в `app.module.ts` оставался TODO), а backend `cfg.VERSION` застрял на `1.53.0` — защита «версия сервера vs фронт» не работала.
- Создан `packages/backend/src/interceptors/check-version.interceptor.ts` (409 Conflict при рассинхроне), зарегистрирован глобально через `APP_INTERCEPTOR`.
- Backend `cfg.VERSION` синхронизирован с фронтом → `2.22.0`.
- Фронт `shared/api/api.ts`: ответный interceptor при 409 + `updateRequired` → `location.reload()` (защита от зацикливания через `sessionStorage`, не чаще 1 reload/3 c).
- `.clinerules/promt-for-dev.md`: правило завершения сессии — версия бампается синхронно в двух файлах (frontend + backend).

### 5. Исправлено залипание старой версии PWA (Service Worker)

- Симптом: после деплоя пользователи получали старый `index.html` (2.21.0) со ссылками на уже удалённые
  чанки → `Expected a JavaScript module but got MIME text/html` (nginx fallback) и вечная старая версия.
- Причина: SW прекэшировал `index.html` (`globPatterns` включал `html`) и раздавал его устаревшим.
- Фикс в `vite.config.ts`: `globPatterns` без `html` + `globIgnores: ['**/index.html']` +
  `navigateFallback: null` (отключён дефолт vite-plugin-pwa) + навигация через `NetworkFirst`
  (свежий index.html из сети, кэш — только офлайн). Проверено: в `sw.js` больше нет
  `createHandlerBoundToURL("index.html")`, precache 35 → 34 entries.
- В `api.ts` при 409 также снимается регистрация SW и очищается кэш (`caches.delete`) перед `reload`.
- Версия поднята до `2.23.0` (frontend + backend синхронно).

### Валидация

- `npm run lint` — 0 ошибок. `npm run build -w packages/backend` — exit 0. `npm run build -w packages/frontend` — exit 0.
- backend test: 16 failed (все предсуществующие валидаторы) — новых нет.
- frontend test: 4 failed (предсуществующие валидаторы `validate-auth-by-login`, `validate-auth-by-login-schema`, `validate-fix-date-schema`, `validate-user-schema`) — новых нет.
- `VERSION` → `2.23.0`, `ASSEMBLY_DATE` → `2026-08-14` (frontend + backend синхронно).
- Обновлён стек в `README.md`/`README.dev.md`: Koa → NestJS + Fastify, PM2 → systemd,
  структура бэкенда (guards/interceptors/main.ts), Zustand + TanStack Query (было Redux Toolkit).

## Следующие шаги

1. (разово, локально) почистить `packages/backend/server/` от старых Koa-файлов, оставшихся от прошлых
   сборок: `rm -rf packages/backend/server && npm run build -w packages/backend`. В `deploy.sh` очистка
   `server/` уже добавлена (в `build_backend` перед `npm run build`), поэтому при следующих деплоях
   мёртвые файлы не накапливаются.
2. (опц., сервер) почистить `/etc/rhythm/rhythm-server.env` от неиспользуемых
   `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` — нужны только как fallback для локального dev
   (в проде работает `GOOGLE_APPLICATION_CREDENTIALS`).
3. Продолжить покрытие тестами по приоритетам `test-policy.md` (Auth, Company, Dashboard — integration-тестов всё ещё нет).
4. Этап 2 (v2.0): оплата/эквайринг, обработка webhook.

## Коммит

`fix: PWA — index.html больше не прекэшируется (NetworkFirst-навигация), убран дефолтный navigateFallback; при рассинхроне версии сброс SW-кэша перед reload`

## Предупреждения/заметки

- Вложенный `packages/frontend/package-lock.json` остался (артефакт до монорепо, не содержит koa) —
  при желании можно тоже удалить, как и backend-вариант.
- React 19 теперь принудительно через `overrides`: если какой-то пакет обновится до строгого peer
  `^18`, `npm install` даст peer-предупреждение (не ERESOLVE — overrides принудительны). Держать в уме.
- `get-session-data-fastify.ts` — fastify-версия, пока нигде не используется (FirebaseAuthGuard
  реализует свою `extractSessionCookie`); оставлена «на будущее», можно удалить при чистке.
- **PWA/SW:** `index.html` больше НЕ прекэшируется (`globIgnores` + `navigateFallback: null` + NetworkFirst
  для навигации). При добавлении новых правил в `workbox` не возвращай дефолтный `navigateFallback` — иначе
  вернётся баг с залипшей старой версией. Пользователям со «старым» SW (до этого фикса) нужен один раз
  сброс кэша: DevTools → Application → Clear site data / Unregister SW.
- **check-version:** версия теперь хранится в двух местах (`packages/frontend/src/app/config/index.ts`
  и `packages/backend/src/app/config/index.ts`) и ДОЛЖНА совпадать. При деплое новой версии обнови оба
  файла, иначе `CheckVersionInterceptor` начнёт отдавать 409 всем клиентам → бесконечный reload.
- `loggerServer` остался в `winston/index.ts` неиспользуемым (после удаления Koa `app/index.ts`); `loggerApp`
  снова используется — в `CheckVersionInterceptor`.
