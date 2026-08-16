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

---

## Правила ведения плана

1. В конце каждой сессии: отметить выполненное `[x]`, обновить `.planning/prompt-for-next.md` (контекст, следующие шаги, коммит), при изменении кода — поднять `VERSION` в двух файлах.
2. В начале каждой сессии: прочитать `.planning/prompt-for-next.md` и `PLAN.md`.
3. Задача считается завершённой, когда `npm run lint` (0 ошибок) и `npm run test -w packages/backend` + `npm run test -w packages/frontend` проходят без ошибок.
