# Аудит покрытия тестами и технического долга «Ритм»

> Дата аудита: 15.08.2026 (сессия 32). Основа — фактический обход `packages/**/src`.
> Актуальные цифры тестов — в `.clinerules/test-policy.md` (обновляются при изменении).

## Текущее покрытие (факт)

| Слой               | Suites | Тесты | Комментарий                                                                             |
| ------------------ | ------ | ----- | --------------------------------------------------------------------------------------- |
| Backend unit       | 103    | 588   | контроллеры (integration) + models + guards/interceptors/decorators + libs/views/config |
| Backend shared     | 50     | 377   | `src/shared/utils/**`                                                                   |
| Backend validators | 17     | 150   | `src/libs/validators/**` + схемы                                                        |
| Frontend           | 427    | 3053  | entities/shared/helpers/lib + smoke-тесты widgets/pages (сессия 44)                     |
| E2E (Playwright)   | 6      | 22    | guest/customer/admin + PWA-manifest                                                     |
| E2E PWA (prod)     | 1      | 6     | `e2e/pwa/offline.spec.ts`                                                               |

## Backend — что НЕ покрыто

### 1. `models/*/services` — бизнес-логика (приоритет 🥇, самый крупный пробел)

~35 сервисных файлов, 754 строки. Покрыты только косвенно через integration-тесты контроллеров;
на уровне юнитов (с моками Firestore/Redis/Email) — нет.

> Прогресс (сессия 33–39): создан общий мок Firestore (`models/tests/mocks/firestore.ts`),
> unit-тестами покрыты auth-, user-, company-, dashboard-view-, templates-, partner- и google-сервисы
> (✅ ниже). Все `models/*/services` покрыты.

- ✅ `models/auth/signup/services/` — create-new-company, create-new-user, complection-user
- ✅ `models/auth/login/services/` — check-is-user-disabled
- ✅ `models/user/services/` — get, update, find-user-by-email, find-user-by-id, set-verification, check-user-verification
- ✅ `models/company/services/` — get, update, delete-sheet
- ✅ `models/dashboard-view/services/` — get-bunches, get-view-items, get-all-views, create-group-items, update, delete-group
- ✅ `models/templates/services/` — get-templates, get-bunches-updated, update, delete
- ✅ `models/partner/services/` — increase-follower, increase-register-started, increase-register-ended
- ✅ `models/google/services/` — get-data

### 2. Guards / Interceptors / Decorators — ✅ покрыты (сессия 40)

- ✅ `guards/firebase-auth.guard.ts` — `canActivate` + `extractSessionCookie` (парсинг куки `uid/sessionCookie`).
  В integration-тестах guard **мокается** (нельзя импортировать — тянет `models` → `libs/redis`, открытый handle);
  unit-тесты мокают `admin-sdk`, `libs/loggers` и `models` (default-экспорт с `__esModule: true`).
- ✅ `interceptors/check-version.interceptor.ts` — 409 при несовпадении `X-Client-Version`.
- ✅ `interceptors/logging.interceptor.ts` — фильтрация `internalUsers` (список из `cfg.INTERNAL_USERS`) + `getUserId` из куки.
- ✅ `decorators/current-user.decorator.ts` — извлечение `request.user` (фабрика вытаскивается через `ROUTE_ARGS_METADATA`).

### 3. `libs/*` — ✅ покрыты (сессия 42)

- ✅ `libs/firebase/auth/` — create-session-fastify, set-cookie-fastify
- ✅ `libs/redis/` — session get/set, signup get/set/update-answer-time (мок `libs/redis/init`)
- ✅ `libs/emails/` — send-mail, send-group-mail (моки pug/juice/nodemailer)

Не покрыты (конфиг с module-level side effects, низкий приоритет): `libs/firebase/config/` (admin-sdk, batchs, fire).

### 4. Прочее — ✅ покрыты (сессия 42)

- ✅ `views/errors/` — `get-error-message`, `err-code`
- ✅ `config/load-env.ts`
- `shared/utils/random/index.ts` (168 строк) — проверить наличие теста (вне этапа 25)

## Frontend — что НЕ покрыто

### 1. `shared/api` — ✅ покрыто (сессия 43)

`api.ts` (axios-клиент: interceptors, обработка 409 от `CheckVersionInterceptor` → сброс SW + reload),
`hooks/` (use-auth-query, use-company-queries, use-dashboard-data-query, use-dashboard-view-queries),
`features/` (company, dashboard-templates, dashboard-view, hints, user).

Не покрыты (вне этапа 26): `api-paths.ts`, `query-keys.ts` (простые константы-объекты).

### 2. `features/*` — ✅ unit-тесты добавлены (сессия 46)

company (DeleteMemberIconContainer), dashboard-data (transform-gs-data, get-ms-from-ref),
dashboard-templates (chartOptionsToRemove), hints (useFeatureHints), ui (ClearCacheBtn), user (store).
Ранее: dashboard-view (4 спека), docs, partner.

### 3. `widgets/*` — ✅ smoke-тесты добавлены (сессия 44 + 46)

Smoke: auth/accept-cookie, sidebar, navbar, footer, dashboard-view/panel, dashboard-data/datebar,
hints, message-bar, page-loader, version, logo-btn, offers, page-error, demo/goto-demo-btn,
ui-configurator, dashboard-templates. Утилиты dashboard-render (14) и view-configurator (6) покрыты unit-тестами ранее.

### 4. `pages/*` — ✅ smoke-тесты добавлены (сессия 44)

Smoke: dashboard, company, company-profile, user-profile, demo, root (+ ранее: login(4), signup(4),
not-found(1), not-access(1), policy(1)).

### 5. `entities/*` — не покрыты blocks, company-type, statistic-type (вероятно, типы/константы — низкий приоритет)

## Технический долг / улучшения (обнаружено в аудите)

> Прогресс (сессия 45): Swagger добавлен, мёртвый код удалён, `any` в guard/interceptors заменён
> на `FastifyRequest`, `internalUsers` вынесен в config.

1. **Rate limiting** — ✅ реализован (сессия 41): `@nestjs/throttler@6.5.0` на auth-эндпоинтах
   (`AuthController`: 10/мин default, login 5/мин, reset 3/мин — против перебора паролей и спама ссылками).
   Не-auth эндпоинты лимитами не покрыты — при необходимости расширить.
2. **Swagger / OpenAPI** — ✅ реализован (сессия 45): `@nestjs/swagger@11.4.6` + Fastify-адаптер.
   Swagger UI на `/api/docs`, OpenAPI JSON на `/api/docs-json`. Документированы все 10 контроллеров
   (9 тегов, 25 эндпоинтов: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`).
3. **Мёртвый код** — ✅ удалён (сессия 45): `loggerServer`, `get-session-data-fastify.ts`,
   `packages/frontend/package-lock.json`, `packages/backend/src/sh`.
4. **Крупные файлы (кандидаты на дробление по test-policy >500 строк):** формально >500 нет:
   - `entities/dashboard-view/model/store.ts` (465) — под порогом, дробление отложено;
   - `widgets/dashboard-view/body-content/index.tsx` (352);
   - `entities/dashboard-templates/model/store.ts` (281);
   - `shared/api/hooks/use-dashboard-view-queries.ts` (199).
5. **Типизация `any`** — ✅ в `firebase-auth.guard.ts`, `logging.interceptor.ts`, `check-version.interceptor.ts`
   заменена на `FastifyRequest` / типизированные ошибки (сессия 45); `any` в контроллерах устранён (сессия 50):
   `@CurrentUser() user: any` → `User`, `catch (err: any)` → `catch (err: unknown)` + `libs/errors/toHttpException`.
6. **Захардкоженные ID** (`internalUsers`) — ✅ вынесены в `cfg.INTERNAL_USERS` (env `INTERNAL_USERS`, сессия 45).
