# Контекст для следующей сессии

## Дата

16.08.2026 (сессия 48)

## Контекст: что сделано в этой сессии

### Этап 47 — реальные сценарии входа/регистрации против эмуляторов (закрыт)

Этап 47 полностью выполнен (47.1–47.5). Реальные сценарии входа/регистрации работают против
Firebase Auth/Firestore/Redis-эмуляторов + сиды.

1. **47.3 Настройка бэкенда на эмуляторы:**
   - `packages/backend/.env` / `.env.example`: добавлены `FIRESTORE_EMULATOR_HOST=localhost:8080`
     и `FIREBASE_AUTH_EMULATOR_HOST=localhost:9099`.
   - `libs/firebase/config/fire.ts`: client SDK подключается через `connectAuthEmulator` под
     env-флагом `FIREBASE_AUTH_EMULATOR_HOST`.
   - **`libs/firebase/config/admin-sdk.ts`: в `admin.initializeApp` явно передан `projectId`**
     (иначе Admin SDK берёт projectId из метаданных → `undefined`, а client SDK использует
     `FIREBASE_PROJECT_ID` → пользователи попадают в разные тенанты Auth-эмулятора, вход —
     `auth/user-not-found`).
2. **Исправлен projectId эмулятора:** `docker-compose.yml` (`command`) и `docker/firebase/Dockerfile`
   (`CMD`) запускали эмуляторы с `--project rhy-thm-su`, а SDK ходили с `rhythm-g2d7`.
   Приведено к `rhythm-g2d7` (совпадает с `FIREBASE_PROJECT_ID`).
3. **47.4 Сиды:** `packages/backend/src/scripts/seed-emulators.ts` (`npm run seed:emulators`) —
   идемпотентный скрипт, создаёт `owner@rhythm.test` / `Password123!` (Auth через
   `admin.auth().createUser`) + активную компанию + пользователя в Firestore. Защита от записи
   в боевой Firebase (требует эмуляторные env-переменные).
4. **47.5 Тесты:** `packages/backend/src/emulators/auth.emulators.spec.ts` + отдельный
   `jest.config-emulators.ts` + `setup-emulators.ts`. Прогон: `npm run test:emulators -w packages/backend`.
   Покрыто: вход seed-пользователя, неверный пароль, полный цикл регистрации
   (byEmailStart → код из Redis → byEmailEnd → вход). Обычный `npm test` их НЕ запускает
   (`.emulators.` добавлен в `testPathIgnorePatterns` в `jest.config.ts`).
5. `VERSION` → **2.48.0** (синхронно в обоих `config/index.ts`), `ASSEMBLY_DATE` = `2026-08-16`.
   Обновлены `PLAN.md` (47.3–47.5), `README.dev.md` (projectId + сиды + test:emulators).

## Следующие шаги

1. **Опционально — Swagger (DTO + `@ApiProperty`/`@ApiBody`):** полные схемы запросов/ответов
   для всех эндпоинтов (пока Swagger UI на `/api/docs` есть, но без детальных DTO).
2. **Опционально — расширить эмулятор-тесты:** getAuth с session cookie
   (`admin.auth().createSessionCookie` + `verifySessionCookie`), сброс пароля.
3. Дальше — по плану развития (новые фичи этапа 2: оплата/эквайринг, либо чистка техдолга).

## Коммит

`feat: эмуляторы Firebase — сиды и реальные сценарии входа/регистрации (этап 47)`

## Предупреждения/заметки

- **projectId эмулятора (`--project` в docker-compose.yml/Dockerfile) ДОЛЖЕН совпадать с
  `FIREBASE_PROJECT_ID` из `packages/backend/.env`.** Иначе client SDK и Admin SDK попадают в
  разные тенанты Auth-эмулятора → вход падает с `auth/user-not-found` (эмулятор пишет
  «Multiple projectIds are not recommended in single project mode»). Зафиксировано в README.dev.md.
- **Admin SDK должен явно получать `projectId` в `initializeApp`** (см. admin-sdk.ts), иначе
  `admin.app().options.projectId === undefined` и та же проблема тенантов.
- `test:emulators` / `seed:emulators` — отдельные npm-скрипты, НЕ входят в обычный `npm test`.
- В Auth-эмуляторе неверный пароль возвращает `auth/wrong-password` (боевой client SDK —
  `auth/invalid-credential`).
- **Анти-спам signup:** между `byEmailStart` и `byEmailEnd` должно пройти ≥ 5 сек
  (`SIGNUP_CODE_ANSWER_DELAY`), иначе 400 «Слишком частая попытка ответа». В эмулятор-тесте —
  задержка `ANSWER_DELAY_MS = 5200`.
- `signupData.partnerId` валидируется как `string` (схема), фронтенд шлёт `''` при отсутствии
  реферера (не `null`).
- **`import/first`:** импорты пишутся ДО `jest.mock(...)`; jest сам поднимает моки (hoisting).
- Конфиги Jest фронтенда: `test:features` матчит только `**/features/**/*.test.ts`; smoke-тесты
  виджетов пишутся как `*.test.tsx` (подхватываются `test:unit`).
- Данные эмуляторов in-memory (сбрасываются при `docker compose down`/рестарте). После рестарта
  нужен повторный `npm run seed:emulators`.
- Актуальные цифры тестов — в `.clinerules/test-policy.md`; аудит — `.planning/codebase/TEST-AUDIT.md`.
