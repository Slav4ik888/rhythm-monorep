# TASK POLICY: Тестирование

## Общие правила

- При любом изменении в `packages/**/*.ts(x)` проверяй, что `npm test` проходит в соответствующем workspace
- Если добавляешь новую функцию в сервис — добавляй unit-тест в `*.spec.ts` рядом с файлом
- Если меняешь API контроллера — добавляй/обновляй integration-тест
- Перед завершением задачи запускай `npm test -w packages/backend` и `npm test -w packages/frontend` и `npm run lint`
- Если тестов на изменённый модуль нет — создай хотя бы smoke-тест

## Двухэтапный процесс написания тестов

### Этап 1: Предложение (Plan)

1. Изучи функцию/сервис/экран который нужно протестировать
2. Составь список тестовых случаев в таблице: № | Сценарий | Тип | Ожидаемый результат
3. Укажи какие моки потребуются
4. Представь список пользователю на утверждение

### Этап 2: Реализация (Act)

1. Дождись подтверждения/правок от пользователя
2. Напиши код тестов
3. Запусти `npm test` в соответствующем workspace
4. Покажи результат

## Дробление больших файлов

- Если файл > 500 строк — рассматривай дробление на несколько файлов в подпапках
- **Каждый выделенный блок помещай в отдельную папку** (не в корень модуля)
- Папка должна называться по домену: `core/`, `vk-oauth/`, `referral/`, `phone-waitcall/` и т.д.
- В каждой подпапке — свой сервис + своя `tests/` подпапка
- Пример структуры после дробления `auth.service.ts`:
  ```
  src/auth/
  ├── core/auth.service.ts + core/tests/
  ├── vk-oauth/vk-oauth.service.ts + vk-oauth/tests/
  ├── phone-waitcall/phone-waitcall.service.ts + phone-waitcall/tests/
  └── ...
  ```

### Definition of Done для дробления

- Задача дробления считается **выполненной** только когда **каждый** файл в затронутом модуле ≤ 500 строк (без учёта тестов и node_modules)
- После дробления обязательно выполнить проверку:
  ```bash
  # Проверить размеры файлов модуля
  find packages/frontend/src/pages/<имя-модуля> -name "*.tsx" -o -name "*.ts" | grep -v "\.spec\." | xargs wc -l | sort -rn | head -10
  ```
- Убедиться, что **максимальное** значение ≤ 500
- Если остались файлы > 500 строк — дробление **не завершено**, задача не закрывается
- В `action-log.md` дробление отмечается ✅ только после проверки размеров всех файлов

## Структура тестовых файлов

- Unit-тесты: `src/auth/auth.service.spec.ts` (рядом с исходным файлом)
- Integration-тесты: `src/auth/tests/auth.controller.spec.ts` (в подпапке `tests/`)
- Моки/фикстуры: `src/auth/tests/mocks/`, `src/auth/tests/fixtures/`

### E2E-тесты (два типа)

**NestJS модульные E2E** — тестируют конкретный модуль через HTTP (в том же процессе):

- `src/auth/tests/e2e/vk-login.spec.ts` (в `tests/e2e/`)

**Playwright сквозные E2E** — тестируют пользовательские сценарии в браузере (отдельный процесс):

- `e2e/guest/pages.spec.ts` — тесты гостя (статичные страницы)
- `e2e/customer/profile.spec.ts` — тесты авторизованного пользователя (личный кабинет)
- `e2e/admin/dashboard.spec.ts` — тесты владельца/админа (профиль компании и дашборд)

Бэкенд и Firebase для E2E не нужны: поднимается только Vite dev-сервер (см. `webServer` в
`playwright.config.ts`), авторизация мокается через `page.route()` — см. `e2e/helpers/mock-auth.ts`.

## Команды для запуска

```bash
# Бэкенд
npm run test -w packages/backend          # Все тесты
npm run test:coverage -w packages/backend  # С покрытием
npm run test:watch -w packages/backend     # Watch mode

# Фронтенд
npm run test -w packages/frontend          # Все тесты
npm run test:coverage -w packages/frontend  # С покрытием
npm run test:watch -w packages/frontend     # Watch mode

# E2E
npx playwright test                        # Все E2E
npx playwright test --project=customer     # Только покупатель
npx playwright test --project=admin        # Только админ
```

## Приоритет блоков для покрытия тестами (Бэкенд)

| Приоритет | Блок                                    | Статус                             |
| --------- | --------------------------------------- | ---------------------------------- |
| 🥇 1      | **Auth (авторизация)**                  | Есть integration-тесты контроллера |
| 🥇 2      | **Company (компании)**                  | Есть integration-тесты контроллера |
| 🥇 3      | **Dashboard (дашборды)**                | Есть integration-тесты контроллера |
| 🥈 4      | **Partner (реферальная программа)**     | Есть integration-тесты контроллера |
| 🥈 5      | **Validators (валидаторы)**             | Есть unit-тесты                    |
| 🥉 6      | **Templates (шаблоны)**                 | Есть integration-тесты контроллера |
| 🥉 7      | **Loggers (логирование)**               | Есть integration-тесты контроллера |
| 🥉 8      | **Docs (документы)**                    | Есть integration-тесты контроллера |
| 🥉 9      | **Google (Google Sheets)**              | Есть integration-тесты контроллера |
| 🥉 10     | **Params Company (параметры компании)** | Есть integration-тесты контроллера |

### Integration-тесты контроллеров (NestJS)

| Контроллер     | Файл                                                                                      | Тесты |
| -------------- | ----------------------------------------------------------------------------------------- | ----- |
| Auth           | `packages/backend/src/controllers/auth/tests/auth.controller.spec.ts`                     | 10    |
| Company        | `packages/backend/src/controllers/company/tests/company.controller.spec.ts`               | 6     |
| Dashboard      | `packages/backend/src/controllers/dashboard/tests/dashboard.controller.spec.ts`           | 9     |
| User           | `packages/backend/src/controllers/user/tests/user.controller.spec.ts`                     | 9     |
| Partner        | `packages/backend/src/controllers/partner/tests/partner.controller.spec.ts`               | 3     |
| Templates      | `packages/backend/src/controllers/templates/tests/templates.controller.spec.ts`           | 9     |
| Docs           | `packages/backend/src/controllers/docs/tests/docs.controller.spec.ts`                     | 2     |
| Loggers        | `packages/backend/src/controllers/loggers/tests/loggers.controller.spec.ts`               | 6     |
| Google         | `packages/backend/src/controllers/google/tests/google.controller.spec.ts`                 | 6     |
| Params Company | `packages/backend/src/controllers/params-company/tests/params-company.controller.spec.ts` | 4     |

#### Правила для integration-тестов NestJS-контроллеров

- Используй `@nestjs/testing` (`Test.createTestingModule`) + `FastifyAdapter` + `app.inject()` — HTTP-запросы без поднятия реального порта.
- Держи `@nestjs/testing` версией, синхронной с `@nestjs/core` (сейчас `11.1.29`). Не удаляй зависимость.
- Модели контроллеры импортируют напрямую (не через DI) — мокай их через `jest.mock('../../../models/...')`.
- **`FirebaseAuthGuard`:** НЕ импортируй реальный guard — он тянет `models` → `libs/redis`, оставляет открытый handle и вешает завершение jest. Мокай модуль пустым классом-токеном + задавай поведение через `overrideGuard(FirebaseAuthGuard).useValue({ canActivate })`.

**Итого (бэкенд):** 146 suites, 1027 тестов (unit 500 + shared 377 + validators 150), включая integration-тесты всех 10 контроллеров.

## Приоритет блоков для покрытия тестами (Фронтенд)

| Приоритет | Блок                | Модули/компоненты                                                                                                                 | Статус |
| --------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 🥇 1      | **Redux-сторы**     | `entities/user/`, `entities/company/`, `entities/dashboard-data/`, `entities/dashboard-view/`, `entities/ui/`                     | -      |
| 🥇 2      | **Shared helpers**  | `shared/helpers/`, `shared/lib/`                                                                                                  | -      |
| 🥇 3      | **Shared API**      | `shared/api/`                                                                                                                     | -      |
| 🥈 4      | **Features (фичи)** | `features/auth/`, `features/dashboard-view/`, `features/company/`, `features/partner/`, `features/user/`                          | -      |
| 🥈 5      | **Widgets**         | `widgets/auth/`, `widgets/sidebar/`, `widgets/navbar/`, `widgets/footer/`, `widgets/dashboard-view/`, `widgets/dashboard-render/` | -      |
| 🥉 6      | **Pages**           | Статические страницы: `not-found`, `not-access`, `policy` (smoke). Остальные — ручное тестирование                                | -      |

### E2E smoke-тесты (Playwright)

| Проект   | Файл                           | Тесты |
| -------- | ------------------------------ | ----- |
| guest    | `e2e/guest/pages.spec.ts`      | 7     |
| guest    | `e2e/guest/auth.spec.ts`       | 4     |
| guest    | `e2e/guest/referral.spec.ts`   | 4     |
| guest    | `e2e/guest/pwa.spec.ts`        | 3     |
| customer | `e2e/customer/profile.spec.ts` | 2     |
| admin    | `e2e/admin/dashboard.spec.ts`  | 2     |

**Итого (весь проект):** 146 suites (backend) + 377 suites (frontend) + 6 suites (e2e) = **529 suites**;
1027 тестов (backend) + 2926 тестов (frontend) + 22 теста (e2e) = **3975 тестов**.

**Покрытие фронтенда:** unit/integration — есть; E2E (Playwright) — smoke-тесты (guest/customer/admin) +
сценарии входа/регистрации (моки `/api/*`), реферальной программы (`?ref=`), PWA (манифест + SW). **Lint:** 0 ошибок.
