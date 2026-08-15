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

- `e2e/guest/catalog.spec.ts` — тесты гостя
- `e2e/customer/profile.spec.ts` — тесты покупателя
- `e2e/admin/dashboard.spec.ts` — тесты админа

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

| Приоритет | Блок                                    | Статус                                   |
| --------- | --------------------------------------- | ---------------------------------------- |
| 🥇 1      | **Auth (авторизация)**                  | Частично (integration-тесты контроллера) |
| 🥇 2      | **Company (компании)**                  | Частично (integration-тесты контроллера) |
| 🥇 3      | **Dashboard (дашборды)**                | Частично (integration-тесты контроллера) |
| 🥈 4      | **Partner (реферальная программа)**     | -                                        |
| 🥈 5      | **Validators (валидаторы)**             | Частично (есть тесты)                    |
| 🥉 6      | **Templates (шаблоны)**                 | -                                        |
| 🥉 7      | **Loggers (логирование)**               | -                                        |
| 🥉 8      | **Docs (документы)**                    | -                                        |
| 🥉 9      | **Google (Google Sheets)**              | -                                        |
| 🥉 10     | **Params Company (параметры компании)** | -                                        |

### Integration-тесты контроллеров (NestJS)

| Контроллер     | Файл                                                                            | Тесты |
| -------------- | ------------------------------------------------------------------------------- | ----- |
| Auth           | `packages/backend/src/controllers/auth/tests/auth.controller.spec.ts`           | 10    |
| Company        | `packages/backend/src/controllers/company/tests/company.controller.spec.ts`     | 6     |
| Dashboard      | `packages/backend/src/controllers/dashboard/tests/dashboard.controller.spec.ts` | 9     |
| Partner        | `packages/backend/src/controllers/partner/`                                     | -     |
| Templates      | `packages/backend/src/controllers/templates/`                                   | -     |
| Docs           | `packages/backend/src/controllers/docs/`                                        | -     |
| Loggers        | `packages/backend/src/controllers/loggers/`                                     | -     |
| Google         | `packages/backend/src/controllers/google/`                                      | -     |
| Params Company | `packages/backend/src/controllers/params-company/`                              | -     |

#### Правила для integration-тестов NestJS-контроллеров

- Используй `@nestjs/testing` (`Test.createTestingModule`) + `FastifyAdapter` + `app.inject()` — HTTP-запросы без поднятия реального порта.
- Держи `@nestjs/testing` версией, синхронной с `@nestjs/core` (сейчас `11.1.29`). Не удаляй зависимость.
- Модели контроллеры импортируют напрямую (не через DI) — мокай их через `jest.mock('../../../models/...')`.
- **`FirebaseAuthGuard`:** НЕ импортируй реальный guard — он тянет `models` → `libs/redis`, оставляет открытый handle и вешает завершение jest. Мокай модуль пустым классом-токеном + задавай поведение через `overrideGuard(FirebaseAuthGuard).useValue({ canActivate })`.

**Итого:** 0 suites (backend) + 0 suites (frontend) = **0 suites**, 0 тестов (backend) + 0 тестов (frontend) = **0 тестов** (unit + integration)

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

| Проект              | Файл | Тесты |
| ------------------- | ---- | ----- |
| e2e (ещё не создан) | -    | -     |

**Итого (весь проект):** 0 suites (unit/integration) + 0 suites (E2E) = **0 suites**, **0 тестов** (0 unit/integration + 0 E2E)

**Покрытие фронтенда:** ~0% (low). **Lint:** 0 ошибок.
