# Аудит покрытия тестами и технического долга «Ритм»

> Дата аудита: 15.08.2026 (сессия 32). Основа — фактический обход `packages/**/src`.
> Актуальные цифры тестов — в `.clinerules/test-policy.md` (обновляются при изменении).

## Текущее покрытие (факт)

| Слой               | Suites | Тесты | Комментарий                                                         |
| ------------------ | ------ | ----- | ------------------------------------------------------------------- |
| Backend unit       | 91     | 546   | контроллеры (integration) + models + guards/interceptors/decorators |
| Backend shared     | 50     | 377   | `src/shared/utils/**`                                               |
| Backend validators | 17     | 150   | `src/libs/validators/**` + схемы                                    |
| Frontend           | 377    | 2926  | entities/shared/helpers/lib + часть widgets/pages                   |
| E2E (Playwright)   | 6      | 22    | guest/customer/admin + PWA-manifest                                 |
| E2E PWA (prod)     | 1      | 6     | `e2e/pwa/offline.spec.ts`                                           |

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
- ✅ `interceptors/logging.interceptor.ts` — фильтрация `internalUsers` (захардкоженные ID) + `getUserId` из куки.
- ✅ `decorators/current-user.decorator.ts` — извлечение `request.user` (фабрика вытаскивается через `ROUTE_ARGS_METADATA`).

### 3. `libs/*` — 0 тестов

- `libs/firebase/` — create-session-fastify, set-cookie-fastify, admin-sdk, batchs, fire
- `libs/redis/` — session get/set, signup get/set/update-answer-time
- `libs/emails/` — send-mail, send-group-mail, email-config

### 4. Прочее

- `views/errors/` — `get-error-message` (119 строк), `err-code`
- `config/load-env.ts`
- `shared/utils/random/index.ts` (168 строк) — проверить наличие теста

## Frontend — что НЕ покрыто

### 1. `shared/api` — 0 тестов (приоритет 🥇)

`api.ts` (axios-клиент: interceptors, обработка 409 от `CheckVersionInterceptor` → сброс SW + reload),
`hooks/` (use-auth-query, use-company-queries, use-dashboard-data-query, use-dashboard-view-queries),
`features/` (company, dashboard-templates, dashboard-view, hints, user), `api-paths.ts`, `query-keys.ts`.

### 2. `features/*` — покрыт только dashboard-view (4 спека), остальные 8 — 0

company, dashboard-data, dashboard-templates, docs, hints, partner, ui, user.

### 3. `widgets/*` — покрыты только dashboard-render (14) и view-configurator (6)

Не покрыты: auth, sidebar, navbar, footer, dashboard-view, dashboard-data, dashboard-templates,
hints, message-bar, page-loader, page-error, offers, demo, logo-btn, ui-configurator, version.

### 4. `pages/*` — smoke только на login(4), signup(4), not-found(1), not-access(1), policy(1)

Не покрыты: dashboard, company, company-profile, user-profile, demo, root.

### 5. `entities/*` — не покрыты blocks, company-type, statistic-type (вероятно, типы/константы — низкий приоритет)

## Технический долг / улучшения (обнаружено в аудите)

1. **Rate limiting** — ✅ реализован (сессия 41): `@nestjs/throttler@6.5.0` на auth-эндпоинтах
   (`AuthController`: 10/мин default, login 5/мин, reset 3/мин — против перебора паролей и спама ссылками).
   Не-auth эндпоинты лимитами не покрыты — при необходимости расширить.
2. **Swagger / OpenAPI** — не реализован (заявлен «в будущем»).
3. **Мёртвый код:**
   - `libs/loggers/winston/index.ts` — `loggerServer` не используется;
   - `libs/firebase/auth/get-session-data-fastify.ts` — не используется;
   - `packages/frontend/package-lock.json` — артефакт до монорепо;
   - `packages/backend/src/sh` — мусорный JSON-файл (125 байт, «Rate limit exceeded»), случайный артефакт.
4. **Крупные файлы (кандидаты на дробление по test-policy >500 строк):** формально >500 нет, но близко:
   - `entities/dashboard-view/model/store.ts` (465);
   - `widgets/dashboard-view/body-content/index.tsx` (352);
   - `entities/dashboard-templates/model/store.ts` (281);
   - `shared/api/hooks/use-dashboard-view-queries.ts` (199).
5. **Типизация `any`:** в `firebase-auth.guard.ts`, `logging.interceptor.ts` (`request: any`, `err: any`) —
   заменить на `FastifyRequest` / типизированные ошибки.
6. **Захардкоженные ID** (`internalUsers`) в `logging.interceptor.ts` — вынести в env/config.
