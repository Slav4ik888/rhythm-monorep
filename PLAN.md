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

### Этап 54 — Чистка техдолга (косметика)

**Удаление мёртвых TODO-комментариев и закомментированного кода** (закрытие пункта «Оставшийся техдолг (кандидаты)» из prompt-for-next сессии 53).

- [x] 54.1 Удалены TODO-комментарии в `models/base/types/base.ts` (`// TODO: remove from this`, `// TODO: алгоритм этого`)
      и в его фронтовом близнеце `entities/base/types/base.ts`.
- [x] 54.2 Удалены закомментированные строки в `models/helpers/get-ref-doc/index.ts`.
- [x] 54.3 Верификация: `lint` (0), backend (181 suites / 1178 тестов), frontend (460 suites / 3189 тестов) — зелёные.
- [x] 54.4 Решение: **платёжный модуль (этап 2, оплата/эквайринг) временно отменён** — до отдельного распоряжения.

### Этап 55 — Production-защита (rate limiting + Swagger + Firebase-правила)

**Закрытие замечаний из ревизии production-готовности.**

- [x] 55.1 `POST /api/increaseFollower` под `ThrottlerGuard` (защита от спама/накрутки счётчика) + `@ApiResponse(429)`.
- [x] 55.2 Swagger `/api/docs` отключён в production (`main.ts`: только при `NODE_ENV !== 'production'`).
- [x] 55.3 `storage.rules` закрыт (`allow read, write: if false`).
- [x] 55.4 Integration-тест 429 для `increaseFollower` (+1 тест).
- [x] 55.5 Верификация: `lint` (0), backend (181 suites / 1179 тестов) — зелёные.

### Этап 56 — Фикс деплоя: package-lock.json блокирует git pull

**Причина:** `npm install` на сервере (версия npm отличается от локальной) перезаписывает
`package-lock.json`, из-за чего `git pull` падал с «local changes would be overwritten».

- [x] 56.1 `deploy.sh`: `git pull` → `git fetch origin` + `git reset --hard origin/main`
      (сервер — чистая выкладка кода, секреты и сборки вне git).
- [x] 56.2 `deploy.sh`: `npm install` → `npm ci` (ставит строго по lock-файлу, не перезаписывает его).
- [x] 56.3 `README.dev.md`: ручной сценарий деплоя обновлён (`git fetch + reset --hard`, `npm ci`).
- [x] 56.4 `VERSION` не поднимался: изменение инфраструктурное, не затрагивает клиентский код/сборку.

### Этап 57 — Фикс: данные Google не кешировались в IndexedDB (перезагружались повторно)

**Причина:** в `entities/dashboard-data/model/store.ts` три экшена (`setActivePeriod`,
`setSelectedPeriod`, `finishGetData`) писали `dataState-*` в `LS.setDataState`, разворачивая весь
Zustand-стор (`...state`). `state` включает action-функции стора, а IndexedDB (`HeavyStorage.set` →
`db.put`) использует structured clone, который бросает `DataCloneError` на функциях. Ошибка глушилась
`__devLog` (в production молчит), поэтому `dataState-*` жил только в in-memory кеше и терялся после
релоада → `hasCachedData` в `pages/dashboard/ui/container.tsx` был `false`, и Google-данные грузились
заново. `bunches-*`/`viewBunchesUpdated-*` кешировались корректно (пишут плоские объекты без функций).

- [x] 57.1 `store.ts`: добавлен `pickDashboardData(state)` — выделяет только сериализуемые поля
      `StateSchemaDashboardData`; заменены `...state` на `...pickDashboardData(state)` в трёх местах записи.
- [x] 57.2 `store.test.ts`: добавлены тесты «сериализуемость данных в LS (IndexedDB)» (3 шт.) — проверяют,
      что в `LS.setDataState` не попадают action-функции.
- [x] 57.3 `README.dev.md`: добавлена заметка о DataCloneError в structured clone при записи в IndexedDB.
- [x] 57.4 Верификация: `lint` (0), backend (181 suites / 1179 тестов), frontend (460 suites / 3195 тестов) — зелёные.

### Этап 58 — Фикс: утечка состояния dashboard-data между компаниями

**Симптом (продакшен):** гость обновил данные чужой компании Б (11.09) → залогинился в свою А →
в дашборде видит «последнее обновление 11.09» и неотрисованные графики (данные Б, view А — коды
не совпадают). Авто-загрузка `/api/getData` не срабатывала.

**Причина:** глобальный Zustand-стор `dashboard-data` не был изолирован по `companyId`. При
переключении компании (логин / SPA-переход `:companyId` → `:companyId` без ремоунта) экшены
`setSelectedPeriod`/`setActivePeriod` вызывались с новым `companyId`, но записывали в кеш
`dataState-${новыйCompanyId}` состояние стора, которое ещё относилось к предыдущей компании
(`pickDashboardData(state)` содержал чужие `startEntities`/`lastUpdated`). Дополнительно
`hasCachedData = !!startEntities` считал пустой объект `{}` за «есть кеш», блокируя автозагрузку.

- ⚠️ **Ключевой момент на будущее:** данные дашборда изолируются по компании только через `companyId` в состоянии стора — любые новые экшены, пишущие в `LS.setDataState(companyId, ...)`, обязаны проверять `companyId === state.companyId`, иначе утечка вернётся.
- [x] 58.1 `StateSchemaDashboardData` + поле `companyId`; `getInitialState`/`pickDashboardData`/`finishGetData` прокидывают его.
- [x] 58.2 Защита от гонки: `setActivePeriod`/`setSelectedPeriod`/`finishGetData` игнорируют вызовы с «чужим» `companyId` (`state.companyId && companyId !== state.companyId → return state`).
- [x] 58.3 `hasCachedData` в `pages/dashboard/ui/container.tsx` — проверка реального количества сущностей (`Object.keys(startEntities).length > 0`), а не truthy-объекта.
- [x] 58.4 Тесты изоляции по `companyId` (+4: «чужой companyId — no-op», «свой companyId — применяется»).
- [x] 58.5 Верификация: `lint` (0), backend (181 suites / 1179 тестов), frontend (460 suites) — зелёные.

### Этап 59 — Проверки перед публикацией в прод (Firebase rules, LOGS_PASS, Redis, секреты)

**Закрытие пункта «Следующие шаги» сессий 55/56 — проверки продакшен-готовности.**

- [x] 59.1 Добавлен `firestore.rules` (закрыт: `allow read, write: if false`) — в репо был только
      `storage.rules`, и `firebase deploy --only firestore:rules` не имел файла правил. Подключён в
      `firebase.json` (`"firestore": { "rules": "firestore.rules" }`) и смонтирован в `docker-compose.yml`.
      Безопасно: все обращения к Firestore идут через бэкенд (Admin SDK, который правила обходит).
- [x] 59.2 Добавлен скрипт `check-prod-readiness.sh` (корень репо): проверка секретов `/etc/rhythm/`,
      `LOGS_PASS`, Redis, systemd-юнита, Nginx + напоминание про Firebase rules.
- [x] 59.3 `README.dev.md`: раздел «Проверки перед публикацией в прод (checklist)» + упоминание `firestore.rules`.
- [x] 59.4 `VERSION` → `2.58.0` в ДВУХ конфигах (клиентский код не менялся, бандл версии синхронизирован).
- [x] 59.5 Верификация: `lint` (0), backend / frontend тесты — зелёные.

### Этап 60 — Выкат в прод: проверки готовности + боевые Firebase-правила

**Ручные шаги на боевом сервере (выполняет человек).**

- [x] 60.1 `bash check-prod-readiness.sh` — все критические проверки пройдены
      (14 OK / 0 FAIL / 5 WARN; WARN — только напоминание про Firebase rules).
- [x] 60.2 Применить боевые правила Firestore: `firebase deploy --only firestore:rules` +
      убедиться в Firebase Console (project `rhythm-g2d7`), что Firestore закрыт
      (`allow read, write: if false`).
- [x] 60.3 Выяснено при деплое: **Firebase Storage в проекте не используется** (только
      Firestore + Auth — в коде нет `uploadBytes`/`getStorage`/`admin.storage()`, лишь поле
      `storageBucket` в стандартном web-конфиге). Деплой `firestore:rules,storage:rules` падает
      с «Firebase Storage has not been set up» (сервис Storage на проекте не включён), поэтому
      деплоятся только `firestore:rules`. `storage.rules` остаётся в репо для эмуляторов и на будущее.
- [x] 60.4 Обновлены `check-prod-readiness.sh` и `README.dev.md`: деплой правил — только
      `firebase deploy --only firestore:rules` + заметка, что Storage в прод не используется.
- [x] 60.5 `VERSION` → `2.59.0` + `ASSEMBLY_DATE` → `2026-09-19` в ДВУХ конфигах.
- [ ] 60.6 Выкатить код в прод (`./deploy.sh` на сервере), чтобы `VERSION 2.59.0` ушёл в прод
      (сейчас бэкенд и фронт в проде на 2.58.0, а в git — 2.59.0).

---

## Правила ведения плана

1. В конце каждой сессии: отметить выполненное `[x]`, обновить `.planning/prompt-for-next.md` (контекст, следующие шаги, коммит), при изменении кода — поднять `VERSION` в двух файлах.
2. В начале каждой сессии: прочитать `.planning/prompt-for-next.md` и `PLAN.md`.
3. Задача считается завершённой, когда `npm run lint` (0 ошибок) и `npm run test -w packages/backend` + `npm run test -w packages/frontend` проходят без ошибок.
