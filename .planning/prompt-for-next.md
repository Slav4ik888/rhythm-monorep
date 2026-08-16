# Контекст для следующей сессии

## Дата

16.08.2026 (сессия 52)

## Контекст: что сделано в этой сессии

### Этап 52 — Rate limiting на не-auth эндпоинтах (закрыт)

Закрыт пункт техдолга «Rate limiting на не-auth эндпоинтах» (продолжение этапа 24, где лимиты были только на auth).

1. **`@UseGuards(ThrottlerGuard)`** добавлен на публичные read-эндпоинты (лимит по умолчанию из `app.module` — 10 запросов/мин на IP):
   - `ParamsCompanyController` (GET+POST `/paramsCompany/get`) — на уровне класса;
   - `DashboardController.bunchGet` (POST `/dashboard/bunch/get`) — `@UseGuards(OptionalFirebaseAuthGuard, ThrottlerGuard)`;
   - `TemplatesController` — `getBunchesUpdated` (GET) и `getTemplates` (POST) — на уровне методов;
   - `DocsController.getPolicy` (GET) — на уровне класса;
   - `GoogleController.getData` (POST) — на уровне класса.
2. **Swagger:** `@ApiResponse({ status: 429 })` добавлен для всех перечисленных эндпоинтов.
3. **Integration-тесты:** в каждый из 5 контроллер-спеков добавлен отдельный `describe` «rate limiting (429)»
   (`ThrottlerModule.forRoot([{ ttl: 60_000, limit: 2 }])` без override guard + последовательные `app.inject`);
   бизнес-тесты переведены на `ThrottlerModule.forRoot([{ ttl: 60_000, limit: 1000 }])` + `overrideGuard(ThrottlerGuard)`.
4. `VERSION` → **2.52.0** (синхронно в обоих `config/index.ts`). Обновлены `PLAN.md` (этап 52),
   `.clinerules/test-policy.md` (цифры + заметка про ThrottlerGuard).

## Следующие шаги

1. **Оставшийся техдолг (кандидаты):**
   - TODO по правам доступа в `models/helpers/get-ref-doc` и `models/base/types` (`// TODO: remove from this`, `// TODO: алгоритм этого`) — косметика/низкий приоритет;
   - `isEditAccess` (временный запрет Конструктора) пока **не проверяется на бэке** — намеренно пропущено,
     чтобы не заблокировать владельца (дефолт `false` в `creatorUser`). Решить, кто и как его включает, прежде чем добавлять гейт;
   - недостающие unit-тесты: `shared/utils/random/index.ts`, `entities/blocks`, `entities/company-type`, `entities/statistic-type`, `api-paths.ts`, `query-keys.ts`;
   - опционально: расширить эмулятор-тесты (getAuth с session cookie, сброс пароля).
2. **Дальше — по плану развития:** этап 2 (оплата/эквайринг).

## Коммит

`feat: rate limiting на не-auth эндпоинтах (этап 52)`

## Предупреждения/заметки

- Лимит для не-auth read-эндпоинтов — общий дефолт `ThrottlerModule.forRoot` (10/мин на IP). Если окажется
  слишком строгим для `getData` (внешний вызов Google Apps Script на обновлении дашборда) — переопределить
  через `@Throttle({ default: { limit, ttl } })` на конкретном эндпоинте, не меняя глобальный дефолт.
- Ошибки моделей кидаются как `Object.assign(new Error(...), { statusCode, body })`; 403 формирует `assert*`
  в `models/company/access/assert.ts` через `ERROR_NAME.PERMISSONS_NOT_ALLOWED` (текст «Нет разрешения на данную операцию»).
- `templates/update` и `templates/delete` под guard (`FirebaseAuthGuard`) — в integration-тестах guard мокается
  пустым классом + `overrideGuard`. В `dashboard.controller.spec.ts` два guard-заглушки → `/* eslint-disable max-classes-per-file */`.
- `dashboard/bunch/get` использует `OptionalFirebaseAuthGuard` (не кидает 401, кладёт `request.user` если есть cookie);
  `@CurrentUser()` там — `User | undefined`.
- Ключ публичного доступа для главной вкладки — `NO_SHEET_ID = 'no_sheetId'` (`dashboard-view/consts`).
- `strict` в `tsconfig.json` бэкенда НЕ включён; `npx tsc --noEmit -p packages/backend/tsconfig.json` — быстрый typecheck.
- Актуальные цифры тестов (после сессии 52): backend **181 suites / 1178 тестов** (unit 112/644 + shared 52/384 +
  validators 17/150), frontend 446 suites / 3093 теста, e2e 22 теста. Обновлять в `.clinerules/test-policy.md`.
