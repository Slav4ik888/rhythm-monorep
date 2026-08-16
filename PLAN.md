# План развития проекта «Ритм»

> Пересоздан 15.08.2026 (сессия 32) после аудита покрытия тестами и технического долга.
> Детали аудита — в `.planning/codebase/TEST-AUDIT.md`.

## Резюме пройденного (этапы 0–21 — закрыты)

Реорганизация завершена:

- монорепо (`packages/frontend`, `packages/backend`, `packages/shared`);
- бэкенд NestJS + Fastify (10 контроллеров), фронт React 19 + Vite + MUI 9;
- Zustand + React Query, IndexedDB + BroadcastChannel-синхронизация;
- PWA (vite-plugin-pwa + workbox, полный офлайн-сценарий на production-сборке);
- E2E Playwright (guest/customer/admin) + PWA-офлайн-тесты.

Покрытие на момент аудита: backend 127 suites / 993 теста; frontend 377 suites / 2926 тестов; E2E 28 тестов.

---

## Новый план (что делать дальше)

### P0 — Unit-тесты бизнес-логики backend

**Этап 22. `models/*/services` — unit-тесты сервисов**

Сервисы сейчас покрыты только косвенно (integration-тесты контроллеров). Покрыть юнитами с моками Firestore/Redis/Email.

- [x] 22.1 Фикстуры/моки Firestore (общий `models/tests/mocks/firestore.ts`); Redis/Email — добавятся в этапе 25 по мере надобности
- [x] 22.2 `auth/signup/services` (create-new-company, create-new-user, complection-user) + `auth/login/services` (check-is-user-disabled)
- [x] 22.3 `user/services` (get, update, find-user-by-email, find-user-by-id, set-verification, check-user-verification)
- [x] 22.4 `company/services` (get, update, delete-sheet)
- [x] 22.5 `dashboard-view/services` (get-bunches, get-view-items, get-all-views, create-group-items, update, delete-group)
- [x] 22.6 `templates/services` (get-templates, get-bunches-updated, update, delete)
- [x] 22.7 `partner/services` (increase-follower, increase-register-started, increase-register-ended)
- [x] 22.8 `google/services` (get-data)

**Этап 23. guards / interceptors / decorators**

- [x] 23.1 `FirebaseAuthGuard` — `extractSessionCookie` (парсинг `uid/session`) + `canActivate` (мок `admin.auth()`)
- [x] 23.2 `CheckVersionInterceptor` — 409 при рассинхроне версии
- [x] 23.3 `LoggingInterceptor` — фильтрация internalUsers + `getUserId`
- [x] 23.4 `CurrentUser` decorator

### P1 — Безопасность: Rate limiting

**Этап 24. Rate limiting на auth-эндпоинтах** (заявлен в требованиях, не реализован)

- [x] 24.1 Подключить `@nestjs/throttler` (или Fastify-эквивалент) + конфигурация
- [x] 24.2 Применить на `/api/auth/login/byEmail`, `/api/auth/signup/*`, `/api/auth/login/resetEmailPassword`
- [x] 24.3 Integration-тесты: превышение лимита → 429

### P2 — Инфраструктурные unit-тесты backend

**Этап 25. libs / views / config**

- [x] 25.1 `libs/firebase` (create-session-fastify, set-cookie-fastify)
- [x] 25.2 `libs/redis` (session get/set, signup get/set/update-answer-time)
- [x] 25.3 `libs/emails` (send-mail, send-group-mail)
- [x] 25.4 `views/errors` (get-error-message, err-code)
- [x] 25.5 `config/load-env`

### P2 — Тесты frontend API/хуков

**Этап 26. `shared/api`**

- [x] 26.1 `api.ts` — interceptors, обработка 409 (сброс SW + reload), повтор запросов
- [x] 26.2 `hooks/` — use-auth-query, use-company-queries, use-dashboard-data-query, use-dashboard-view-queries
- [x] 26.3 `features/*` (company, dashboard-templates, dashboard-view, hints, user, docs, partner)

### P3 — Smoke-тесты frontend UI

**Этап 27. widgets / pages**

- [x] 27.1 `widgets/` — auth, sidebar, navbar, footer, dashboard-view, dashboard-data, hints, message-bar, page-loader
- [x] 27.2 `pages/` — dashboard, company, company-profile, user-profile, demo, root

### P4 — Чистка техдолга + документация

**Этап 28. Чистка и документация API**

- [x] 28.1 Удалить мёртвый код: `loggerServer`, `get-session-data-fastify.ts`, вложенный `packages/frontend/package-lock.json`, `packages/backend/src/sh`
- [x] 28.2 Вынести `internalUsers` из `LoggingInterceptor` в env/config (`cfg.INTERNAL_USERS`, env `INTERNAL_USERS`)
- [x] 28.3 Заменить `any` на типы (`FastifyRequest`) в guard/interceptors
- [x] 28.4 Swagger / OpenAPI для API-контрактов (`@nestjs/swagger`, Swagger UI на `/api/docs`)
- [x] 28.5 Дробление крупных файлов — ревизия: оба файла ≤ 500 строк (465 и 352), дробление не требуется по DoD test-policy

**Этап 29. Закрытие frontend-пробелов из TEST-AUDIT.md**

- [x] 29.1 Unit-тесты `features/`: company (DeleteMemberIconContainer), dashboard-data (transform-gs-data, get-ms-from-ref), dashboard-templates (chartOptionsToRemove), hints (useFeatureHints), ui (ClearCacheBtn), user (store)
- [x] 29.2 Smoke-тесты `widgets/`: version, logo-btn, offers, page-error, demo/goto-demo-btn, ui-configurator, dashboard-templates

### Этап 47 — Реальные сценарии входа/регистрации против эмуляторов (разблокировано)

**Реальные сценарии входа/регистрации** против Firebase Auth/Firestore/Redis-эмуляторов + сиды.

- [x] 47.1 Установлен Docker Desktop 29.7.2 + `docker compose` v5.3.1 (macOS arm64)
- [x] 47.2 Поднят стек эмуляторов (`docker-compose.yml`): официальный Firebase Emulator Suite
      (Auth 9099 / Firestore 8080 / Storage 9199 / UI 4000) + Redis 6379. Заменены удалённые/устаревшие
      сторонние образы (`spurin/firebase-auth-emulator` и др.) на Emulator Suite
      (`docker/firebase/Dockerfile` + `firebase.json` + `storage.rules`)
- [x] 47.3 Настроить бэкенд на эмуляторы: `FIRESTORE_EMULATOR_HOST` / `FIREBASE_AUTH_EMULATOR_HOST`
      в `.env` + `connectAuthEmulator` для client SDK `firebase/auth` (+ `projectId` в `admin.initializeApp`)
- [x] 47.4 Сиды (seed-данные пользователя/компании) в эмуляторы (`scripts/seed-emulators.ts`, `npm run seed:emulators`)
- [x] 47.5 Реальные сценарии входа/регистрации против эмуляторов (тесты: `*.emulators.spec.ts`, `npm run test:emulators`)

### Этап 49 — Swagger: детальные DTO-схемы запросов/ответов

**Полные схемы запросов/ответов** для всех 25 эндпоинтов (Swagger UI `/api/docs` уже был, но без детальных DTO).

- [x] 49.1 Общие DTO сущностей (`packages/backend/src/dto/`): `base.dto`, `common.dto`, `user.dto`, `company.dto`, `view-item.dto`, `template.dto`
- [x] 49.2 DTO запросов/ответов для каждого контроллера (`packages/backend/src/controllers/<name>/dto/`): auth, user, company, dashboard, templates, partner, params-company, google, docs
- [x] 49.3 Подключены в контроллеры: `@ApiBody({ type })`, `@ApiResponse({ status, type })`, `@ApiQuery` (params-company GET). Типы `@Body()`/`@Query()` оставлены модельными (DTO — только декораторами)
- [x] 49.4 Верификация: `SwaggerModule.createDocument` → 25 путей, 49 схем; `tsc`, `lint` (0), backend (170/1115) и frontend (446/3093) тесты — зелёные

### Этап 50 — Чистка техдолга: типизация `any` в контроллерах бэкенда

**Устранение `any` в NestJS-контроллерах** (оставшийся техдолг из TEST-AUDIT, пункт «Типизация any»).

- [x] 50.1 Общий хелпер ошибок `libs/errors/` (`ApiError`, `isApiError`, `toHttpException`) + unit-тест
- [x] 50.2 `@CurrentUser() user: any` → `User`; `@Body() body: { companyData: any }` → `PartialCompany`
- [x] 50.3 `catch (err: any)` → `catch (err: unknown)` с единой конвертацией в `toHttpException` (все 10 контроллеров)
- [x] 50.4 `Promise<any>` → конкретные типы (`PartialCompany`, `SuccessResponseDto`, `FastifyReply`, `Record<string, never>`); `@Req() request: any` → типизированный `RequestWithCookies` (google)
- [x] 50.5 Верификация: `tsc`, `lint` (0), backend-тесты (171 suites / 1119 тестов) — зелёные

### Этап 51 — Server-side права доступа и валидация полей в handlers

**Закрытие TODO «Permissions / Remove fields / validate» в `models/*/handlers`** (пропущенная server-side логика из TEST-AUDIT).

- [x] 51.1 Модуль контроля доступа `models/company/access/` (зеркалит фронтовой `use-access`):
      `ACCESS_PRIORITY`, `isOwner`, `isPrivileged`, `getUserDashboardAccess`, `canAccess`,
      `checkDashboardAccess`, `canEditCompany`, `canEditDashboard` + `assert*` (кидают 403).
- [x] 51.2 Утилиты `pick`/`omit` (`shared/utils/objects`) + фильтры полей (whitelist) для защиты от mass assignment:
      `filterCompanyData`, `filterUserData`, `toParamsCompany`, `filterViewItem`.
- [x] 51.3 Подключены права + фильтрация в handlers: company update/delete-sheet (владелец/привилегированные),
      user update (person/settings, id/companyId из аутентифицированного пользователя),
      dashboard-view create/update/delete (владелец или участник с правом `e`),
      templates update/delete (владелец/привилегированные; добавлен `FirebaseAuthGuard`).
- [x] 51.4 `OptionalFirebaseAuthGuard` + `extractSessionCookie`; проверка доступа в публичный
      `dashboard/bunch/get` (`checkDashboardAccess` requiredAccess `v`), публичная проекция
      `paramsCompany/get` (без `ownerId`/`createdAt`/`lastChange`).
- [x] 51.5 Контроллеры передают `user` вместо `userId`; обновлены integration-тесты контроллеров;
      unit-тесты access/фильтров/guard. Верификация: `tsc`, `lint` (0),
      backend (181 suites / 1173 теста), frontend (446 suites / 3093 теста) — зелёные.

### Этап 52 — Rate limiting на не-auth эндпоинтах

**Защита публичных read-эндпоинтов от DoS** (закрытие пункта техдолга «Rate limiting на не-auth эндпоинтах» из prompt-for-next сессии 51; продолжение этапа 24, где лимиты были навешаны только на auth).

- [x] 52.1 Подключён `@UseGuards(ThrottlerGuard)` на публичных эндпоинтах:
      `paramsCompany/get` (GET+POST), `dashboard/bunch/get` (POST, вместе с `OptionalFirebaseAuthGuard`),
      `templates/getBunchesUpdated` (GET), `templates/getTemplates` (POST), `getPolicy` (GET), `getData` (POST).
      Лимит по умолчанию из `app.module` (`ThrottlerModule.forRoot`, 10 запросов/мин на IP).
- [x] 52.2 Документирован статус 429 в Swagger (`@ApiResponse({ status: 429 })`) для всех перечисленных эндпоинтов.
- [x] 52.3 Integration-тесты 429: отдельный `describe` с `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])`
      без override guard + последовательные `app.inject` (по образцу `auth.controller.spec.ts`).
      Бизнес-тесты переведены на `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])` + `overrideGuard(ThrottlerGuard)`.
- [x] 52.4 Верификация: `tsc`, `lint` (0), backend (181 suites / 1178 тестов), frontend (446 suites / 3093 теста) — зелёные.

### Этап 53 — Unit-тесты пропущенных frontend-модулей

**Закрытие пункта техдолга «недостающие unit-тесты» из TEST-AUDIT** (раздел «Не покрыты»: `api-paths.ts`, `query-keys.ts` и сущности без тестов).

- [x] 53.1 `shared/helpers/random` — unit-тесты всех функций (`getRandomNumber`, `getRandomNumbers`, `getRandomEngLitera`,
      `getRandomPasswordChar`, `getRandomLetters` + fixed-length, `getRandomElement`, `getRandomBoolean`, `getMixedArray`).
- [x] 53.2 `shared/api/api-paths.ts` — регрессионный тест эндпоинтов (сверка с глоссарием) + проверка отсутствия `/api`-префикса.
- [x] 53.3 `shared/api/query-keys.ts` — тест генераторов ключей TanStack Query.
- [x] 53.4 `entities/statistic-type` — тесты конфига `STATISTIC_PERIOD_TYPE` и утилит
      `gelStatisticPeriodLabel`/`gelStatisticPeriodColor`.
- [x] 53.5 `entities/company-type` (`CompanyTypeChip`) и `entities/blocks` (`DashboardBoxContainer`) — smoke-тесты (`.test.tsx`).
- [x] 53.6 Верификация: `lint` (0), backend (181 suites / 1178 тестов), frontend (460 suites / 3189 тестов) — зелёные.

---

## Правила ведения плана

1. В конце каждой сессии: отметить выполненное `[x]`, обновить `.planning/prompt-for-next.md` (контекст, следующие шаги, коммит), при изменении кода — поднять `VERSION` в двух файлах.
2. В начале каждой сессии: прочитать `.planning/prompt-for-next.md` и `PLAN.md`.
3. Задача считается завершённой, когда `npm run lint` (0 ошибок) и `npm run test -w packages/backend` + `npm run test -w packages/frontend` проходят без ошибок.
