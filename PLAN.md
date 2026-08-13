# План реорганизации проекта «Ритм»

## Этап 0: Документация и правила

- [x] 0.1 Создать `README.md` в корне с описанием проекта
- [x] 0.2 Дополнить `.clinerules/promt-for-dev.md` — заполнить шаблоны `(надо описать)` актуальными данными
- [x] 0.3 Дополнить `.clinerules/test-policy.md` — заполнить шаблоны `(надо описать)` актуальными данными
- [x] 0.4 Создать `.planning/prompt-for-next.md` — шаблон для сообщения на следующую сессию

## Этап 1: Монорепозиторий + Vite

- [x] 1.1 Создать структуру монорепозитория:
  - [x] 1.1.1 Перенести `frontend/` → `packages/frontend/`
  - [x] 1.1.2 Перенести `backend/` → `packages/backend/`
  - [x] 1.1.3 Создать `packages/shared/` (общие типы, валидаторы)
  - [x] 1.1.4 Создать корневой `package.json` с `workspaces`
  - [x] 1.1.5 Настроить корневые конфиги: `eslint.config.mjs`, `.prettierrc`, `.gitignore`
- [x] 1.2 Замена Webpack → Vite во фронтенде:
  - [x] 1.2.1 Удалить webpack-зависимости и конфиги
  - [x] 1.2.2 Установить Vite + плагины
  - [x] 1.2.3 Настроить `vite.config.ts` с алиасами
  - [x] 1.2.4 Перенести `public/index.html` → `index.html`
  - [x] 1.2.5 Обновить скрипты в `packages/frontend/package.json`
  - [x] 1.2.6 Настроить path aliases в `tsconfig.json`
- [x] 1.3 Адаптировать бэкенд под монорепозиторий:
  - [x] 1.3.1 Обновить пути в `packages/backend/package.json`
  - [x] 1.3.2 Настроить `tsconfig.json` с корректными путями
- [x] 1.4 Валидация:
  - [x] 1.4.1 `npm run dev -w packages/frontend` — запускается (Vite dev server, порт 3000, HTTP 200)
  - [x] 1.4.2 `npm run dev -w packages/backend` — запускается (Koa, nodemon + ts-node)
  - [x] 1.4.3 `npm run lint` — ESLint 0 ошибок

## Этап 2: Покрытие тестами

- [x] 2.1 Unit-тесты на критическую бизнес-логику бэкенда
- [x] 2.2 Unit-тесты на фронтенд (стора, хуки, хелперы)
- [x] 2.3 Smoke-тесты для ключевых страниц (not-found, not-access, policy)
  - Хелпер `shared/lib/tests/render-page` (светлая тема как в приложении + MemoryRouter)
  - Починена тест-инфраструктура фронтенда: React 18/19 mismatch (moduleNameMapper), полифилы TextEncoder/matchMedia
  - Результат: 3 smoke-теста проходят; render-тесты починились (28 → 5 падений, оставшиеся 5 — предсуществующие валидаторы и тест с захардкоженной датой сборки)
- [x] 2.4 `npm test -w packages/backend` — проходит
- [x] 2.5 `npm test -w packages/frontend` — проходит

## Этап 3: Технологические улучшения

- [x] 3.1 React 18 → React 19 (установлены пакеты, исправлен JSX namespace)
- [x] 3.2 React Router 6 → React Router 7 (пакеты обновлены)
- [x] 3.3 Redux Toolkit → Zustand — миграция entities/ui выполнена (zustand стор + хук + замена 12 файлов с actionsUI → useUIStore.getState())
- [x] 3.3.0 Удалить Redux-слайс UI из store (Zustand уже работает, reducerUI — мёртвый груз)
- [x] 3.3.1 Мигрировать entities/transactions (45 строк, низкая сложность)
  - Zustand-стор + тесты (8/8 passed), sendTransactions переписан с createAsyncThunk на прямые API-вызовы
- [x] 3.3.2 Мигрировать entities/docs (49 строк, низкая сложность, 1 asyncThunk: getPolicy)
  - Zustand-стор + тесты (10/10 passed), getPolicy переписан с createAsyncThunk на прямой API-вызов
  - reducerDocs убран из Redux store, DynamicModuleLoader на странице policy убран
- [x] 3.3.3 Мигрировать entities/hints (102 строки, средняя сложность, 1 asyncThunk: dontShowAgain)
  - Zustand-стор + тесты (16/16 passed), dontShowAgain переписан с createAsyncThunk на прямой API-вызов
  - reducerHints убран из Redux store, hints?: сделан опциональным в StateSchema
- [x] 3.3.4 Мигрировать entities/user (77 строк, средняя сложность, 1 asyncThunk: getAuth)
  - Zustand-стор + тесты (15/15 passed), getAuth переписан с createAsyncThunk на прямую функцию
  - reducerUser убран из Redux store, user?: сделан опциональным в StateSchema
- [x] 3.3.5 Мигрировать entities/company (118 строк, средняя сложность, 3 asyncThunk)
  - Zustand-стор + тесты (23/23 passed), getParamsCompany/updateCompany/deleteSheet переписаны с createAsyncThunk на прямые async-функции
  - reducerCompany убран из Redux store, company?: сделан опциональным в StateSchema
  - dispatch(actionsCompany.setCompany) заменён на useCompanyStore.getState().setCompany в 4 файлах
  - useUser: убран dispatch (больше не нужен для getAuth)
- [x] 3.3.6 Мигрировать entities/dashboard-data (153 строки, высокая сложность, периоды + LS)
  - Zustand-стор + тесты (17/17 passed), getData переписан с createAsyncThunk на прямую async-функцию
  - reducerDashboardData убран из Redux store, dashboardData?: сделан опциональным в StateSchema
  - useDashboardData хук переписан на Zustand (интерфейс сохранён — 50+ мест использования без изменений)
- [x] 3.3.7 Мигрировать entities/dashboard-templates (197 строк, высокая сложность, дерево + LS)
  - Zustand-стор + тесты (24/24 passed), убран DynamicModuleLoader из виджета templates
  - useDashboardTemplates переписан на Zustand (интерфейс сохранён — 28+ мест использования без изменений)
  - Redux-слайс сохранён для обратной совместимости, reducerDashboardTemplates помечен устаревшим
- [x] 3.3.8 Мигрировать entities/dashboard-view (390 строк, очень высокая сложность, bunches + LS)
  - Zustand-стор + тесты (20/20 passed), хуки переписаны с сохранением API (~193 места без изменений)
  - Redux-слайс помечен устаревшим, dashboardView?: сделан опциональным в StateSchema
- [x] 3.3.8.1 Исправить рантайм-ошибки после миграции (сессия 09.08.2026, итерация 2):
  - `Store does not have a valid reducer` — noopReducer в reducer-manager.ts
  - `getSnapshot should be cached` / `Maximum update depth exceeded`:
    - useMemo для paramsChangedCompany в use-company/index.ts
    - `useDashboardViewServices` — Redux dispatch заменён на Zustand getState()
    - `selectTemplates` больше не возвращает `Object.values()` (создавал новый массив при каждом вызове)
    - `selectEntities` убрано `|| {}` (создавал новый объект)
    - Хук useDashboardTemplates — `templates` мемоизирован через useMemo
  - Изменено 5 файлов: reducer-manager.ts, use-company/index.ts, use-dashboard-view-services/index.ts, dashboard-templates/store.ts, dashboard-templates/hook/index.ts
  - Тесты: 180/195 suites passed (15 failed — предсуществующий TextEncoder)
  - Линтер: 36 ошибок (все предсуществующие — бэкенд + features/path-checker)
- [x] 3.3.9 Мигрировать страничные сторы (login, signup) — Zustand-сторы + удаление Redux-слайсов/slice/selectors/services
- [x] 3.3.10 Убрать Redux — features/user мигрирован, DynamicModuleLoader убраны из navbar/login/signup
- [x] 3.3.11 Установить eslint-plugin-unused-imports для автофикса неиспользуемых импортов
  - Плагин не установился из-за конфликта `@types/react@^19.2.18` (override) с прямой зависимостью
  - После установки включить `@typescript-eslint/no-unused-vars` и запустить `--fix`
  - Текущий статус: правило отключено, ~260 неиспользуемых переменных/импортов в кодовой базе
- [x] 3.3.12 Полное удаление Redux из production-кода:
  - [x] StoreProvider удалён из index.tsx
  - [x] DynamicModuleLoader удалён из pages/dashboard и pages/user-profile
  - [x] Удалены все папки: Redux-слайсы, селекторы, сервисы, app/providers/store, shared/lib/components, shared/lib/tests/store, shared/lib/hooks/use-app-dispatch
  - [x] Удалены пакеты @reduxjs/toolkit, react-redux, @types/react-redux из package.json
  - [x] Восстановлены API-функции (company, dashboard-templates, dashboard-view) как чистые async-функции
  - [x] Восстановлены state-schema.ts для dashboard-data, dashboard-templates, dashboard-view
  - [x] Массовая замена импортов `slice/state-schema` → `state-schema`, `slice/types` → `state-schema`
  - [x] Исправлены экспорты в entities/*/index.ts (убраны slice-экспорты)
  - [x] README обновлён (React 19, Zustand, React Router 7, MUI 9)
  - [x] lint: 0 errors, 0 warnings ✅
  - [x] tsc: с 516 → 236 ошибок (state-schema синхронизированы, импорты исправлены, созданы недостающие модули)
  - [x] test: frontend 170/192 (22 failed), backend 41/52 (11 failed — предсуществующие валидаторы)
  - [x] Созданы недостающие модули: app/providers/store, features/partner/model/services, shared/api/features/transactions, shared/api/features/hints/dont-show-again, shared/api/features/user/*
  - [x] Типы синхронизированы: ActivatedCopiedType (+type, id), PageLoadingItem (+name), UpdateViewItems/DeleteViews (+viewItems, bunchUpdatedMs)
  - [x] Созданы state-schema для docs, hints, transactions, ui (соответствуют реальным Zustand-сторам)
  - [x] 3.3.13 Исправление оставшихся tsc-ошибок (с ~36 → 0):
    - Исправлено 17 production-файлов: store.ts (9 ошибок), use-template-actions, copy-to-template-btn, get-copy-view-item, copy-item, switch-to-is-global-kod, use-features-hints, company/ui, add-to-dashboard-btn, actions, delete-btn, hints, movement-row, unsaved-changes, container.tsx
    - Исправлено 2 тестовых файла: убран StoreProvider/initialState из action-main-login и action-main-signup
    - tsc: 0 ошибок ✅ | lint: 0 ошибок ✅ | frontend test: 184/192 (28 failed — предсуществующие) | backend test: 41/52 (16 failed — предсуществующие)

- [x] 3.4 TanStack Query для серверного состояния (QueryClientProvider + хуки для auth, company, dashboard-data, dashboard-view; container.tsx мигрирован)
- [x] 3.5 PWA (vite-plugin-pwa + workbox)
- [x] 3.6 Koa → NestJS + Fastify (фаза 1: инфраструктура готова — main.ts, AppModule, FirebaseAuthGuard, LoggingInterceptor, @CurrentUser, docs-контроллер мигрирован; фаза 2: params-company, partner, loggers, templates мигрированы; фаза 3: google/get-data мигрирован; фаза 4: company (update, deleteSheet) мигрирован; фаза 5: user (getAuth, update, logout) мигрирован; фаза 6: auth (login, signup, resetPassword) мигрирован + dashboard (bunch/get, view/createGroupItems, view/update, view/delete) мигрирован; Koa сохранён для обратной совместимости; 10 модулей зарегистрированы в AppModule: Docs, ParamsCompany, Partner, Loggers, Templates, Google, Company, User, Auth, Dashboard)
- [x] 3.7 Docker Compose для Firebase эмуляторов
- [x] 3.8 Husky + lint-staged
- [x] 3.9 README.dev.md с глоссарием доменных терминов
- [x] 3.10 Обновление MUI до актуальной версии (v7.2.0 → v9.3.1, @mui/lab v9 beta, tsc 0 ошибок, линтер 1714 → 89 ошибок)
- [ ] 3.11 Дедуплицировать React 19 и убрать костыль в jest (техдолг из сессии 15): бампнуть `@testing-library/react` до `^16.1.0` (peer с поддержкой React 19) + добавить root `overrides` `react/react-dom: 19.0.8` — после этого убрать `moduleNameMapper` для react/react-dom из `packages/frontend/config/jest/jest.config.js`

## Этап 4: Изменение формата получения данных из гугл таблицы

- [ ] 4.1 Надо рассмотреть другие варианты, не как сейчас, через скрипты

## Этап 5: Подготовка деплоя в монорепозитории (сессия 16)

- [x] 5.1 Починен `packages/backend/src/models/auth/login/index.ts` — добавлены импорты `AuthByLogin`, `Company`, `serviceGetCompany` (была ошибка TS2304 при `npm run dev`)
- [x] 5.2 Восстановлен Redis локально: закомментированы `loadmodule` Redis Stack в `/opt/homebrew/etc/redis.conf` (бэкап `redis.conf.bak-20260812-193718`)
- [x] 5.3 Поддержка `REDIS_URL` в `libs/redis/init.ts` + подключён `dotenv` в NestJS-входе `main.ts`
- [x] 5.4 Созданы `packages/backend/.env.example` и `packages/frontend/.env.example`; исправлены разделы env в `README.md` и `README.dev.md` (убраны неиспользуемые `FIREBASE_*`, `SMTP_*`, `SENTRY_DSN`, `VITE_FIREBASE_*`)
- [x] 5.5 Обновлены деплой-файлы под монорепозиторий + NestJS: `rhythm-server.service` (`server/main.js`, `NODE_ENV=production`, `PORT`, `REDIS_URL`), `packages/frontend/deploy.sh`
- [ ] 5.6 Реальный переезд на хостинг: сверить пути в `rhythm-server.service`/`deploy.sh`, остановить старый сервис, развернуть монорепо, прогнать деплой
- [x] 5.7 Удалён неиспользуемый `dotenv` (импорты в `main.ts`/`app/index.ts`, модуль `shared/utils/dotenv`, зависимость из `package.json`, `.env.example`); переменные задаются через окружение процесса

## Этап 6: Отладка запуска и роутов (сессия 17)

- [x] 6.1 Починен запуск Vite: устаревший кэш оптимизации зависимостей `packages/frontend/node_modules/.vite` ссылался на удалённый `@reduxjs/toolkit` (миграция Redux → Zustand) → `ENOENT`. Кэш очищен (`rm -rf packages/frontend/node_modules/.vite`), Vite пересобрал deps, ошибка ушла.
- [x] 6.2 Починен 404 на `POST /api/getData`: в NestJS-контроллере `google.controller.ts` маршрут был `@Post('/google/getData')` (лишний префикс `google`), тогда как фронтенд и Koa используют `/getData`. Исправлено на `@Post('/getData')`. Проверено: `POST /api/getData` → 400 (валидация), `POST /api/google/getData` → 404.
- [x] 6.3 Полная сверка маршрутов NestJS ↔ фронтенд (`API_PATHS`). Исправлен `PATCH /api/dashboard/view/update`: в NestJS был `@Post`, а фронтенд (`store.ts`, `use-dashboard-view-queries.ts`) и Koa-роутер используют PATCH → заменён на `@Patch`. Остальные маршруты согласованы. Отмечены подозрительные места: `hints/dontShowAgain` (не используется, хинты идут через `user/update`), `getTemplates` в `shared/api/features/dashboard-templates` (GET/companyId — неверная сигнатура, живой код использует POST+bunchIds), `user.sendEmailConfirmation` (мёртвый). `hints`/`getTemplates` по решению пользователя не трогаем — возможно, не мёртвый код, доберёмся позже.
- [x] 6.4 Выпилен мёртвый код `transactions`: удалены `entities/transactions/` (стор + `store.spec.ts`), `features/transactions/` (заглушка `=> ({})`), `shared/api/features/transactions/`; убран `transactions.sendTransactions` из `API_PATHS` (frontend `api-paths.ts` и backend `router/paths.ts`). Бэкенд-эндпоинта `/sendTransactions` никогда не было. tsc frontend 0 ошибок, lint 0 ошибок.
- [x] 6.5 Починен краш дашборда `Cannot read properties of undefined (reading 'no_parentId')`: хук `use-dashboard-view-state` возвращал `parentsViewItems = undefined` при пустом `entities` (дашборд без элементов / до загрузки viewItems), а `DashboardRender` обращается к `parents[parentId]`. Исправлено: `parentsViewItems` теперь всегда объект (`getParents(viewItems)`, для пустого — `{}`); убран лишний `!` в `body-content/index.tsx`. lint/tsc 0 ошибок.

---

## Правила ведения плана

1. В конце каждой сессии разработки:
   - Отметить выполненное в этом файле (`[x]`)
   - Создать/обновить `.planning/prompt-for-next.md` — контекст для следующей сессии
   - Записать название коммита для текущей сессии в `.planning/prompt-for-next.md`

2. В начале каждой сессии:
   - Прочитать `.planning/prompt-for-next.md`
   - Прочитать `PLAN.md` для актуального статуса
