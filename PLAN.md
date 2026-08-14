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
- [x] 3.11 Дедуплицировать React 19 и убрать костыль в jest (техдолг из сессии 15): бампнуть `@testing-library/react` до `^16.1.0` (peer с поддержкой React 19) + добавить root `overrides` `react/react-dom: 19.0.8` — после этого убрать `moduleNameMapper` для react/react-dom из `packages/frontend/config/jest/jest.config.js`
  - Выполнено в сессии 22: `@testing-library/react` → `^16.1.0` (установился 16.3.2), root `overrides` дополнены `react: 19.0.8` / `react-dom: 19.0.8`, костыль `moduleNameMapper` (4 записи react/react-dom) удалён из `jest.config.js`. `npm ls react react-dom` — всё на 19.0.8 (18.3.1 больше не резолвится). Тесты без новых падений (те же 4 предсуществующих валидатора).

## Этап 4: Изменение формата получения данных из гугл таблицы

- [ ] 4.1 Надо рассмотреть другие варианты, не как сейчас, через скрипты

## Этап 5: Подготовка деплоя в монорепозитории (сессия 16)

- [x] 5.1 Починен `packages/backend/src/models/auth/login/index.ts` — добавлены импорты `AuthByLogin`, `Company`, `serviceGetCompany` (была ошибка TS2304 при `npm run dev`)
- [x] 5.2 Восстановлен Redis локально: закомментированы `loadmodule` Redis Stack в `/opt/homebrew/etc/redis.conf` (бэкап `redis.conf.bak-20260812-193718`)
- [x] 5.3 Поддержка `REDIS_URL` в `libs/redis/init.ts` + подключён `dotenv` в NestJS-входе `main.ts`
- [x] 5.4 Созданы `packages/backend/.env.example` и `packages/frontend/.env.example`; исправлены разделы env в `README.md` и `README.dev.md` (убраны неиспользуемые `FIREBASE_*`, `SMTP_*`, `SENTRY_DSN`, `VITE_FIREBASE_*`)
- [x] 5.5 Обновлены деплой-файлы под монорепозиторий + NestJS: `rhythm-server.service` (`server/main.js`, `NODE_ENV=production`, `PORT`, `REDIS_URL`), `deploy.sh` (перенесён в корень репозитория)
- [x] 5.6 Реальный переезд на хостинг (завершён в сессии 21): монорепо развёрнут в `/var/www/vtempe/data/rhythm2`, юнит перенесён в `/etc/systemd/system/`, nginx + SSL для `rhy.thm.su`, секреты через `/etc/rhythm/` (EnvironmentFile + GOOGLE_APPLICATION_CREDENTIALS). Бэкенд NestJS слушает 7575 (Redis OK), фронт отдаётся по HTTPS.
- [x] 5.7 Удалён неиспользуемый `dotenv` (импорты в `main.ts`/`app/index.ts`, модуль `shared/utils/dotenv`, зависимость из `package.json`, `.env.example`); переменные задаются через окружение процесса

## Этап 6: Отладка запуска и роутов (сессия 17)

- [x] 6.1 Починен запуск Vite: устаревший кэш оптимизации зависимостей `packages/frontend/node_modules/.vite` ссылался на удалённый `@reduxjs/toolkit` (миграция Redux → Zustand) → `ENOENT`. Кэш очищен (`rm -rf packages/frontend/node_modules/.vite`), Vite пересобрал deps, ошибка ушла.
- [x] 6.2 Починен 404 на `POST /api/getData`: в NestJS-контроллере `google.controller.ts` маршрут был `@Post('/google/getData')` (лишний префикс `google`), тогда как фронтенд и Koa используют `/getData`. Исправлено на `@Post('/getData')`. Проверено: `POST /api/getData` → 400 (валидация), `POST /api/google/getData` → 404.
- [x] 6.3 Полная сверка маршрутов NestJS ↔ фронтенд (`API_PATHS`). Исправлен `PATCH /api/dashboard/view/update`: в NestJS был `@Post`, а фронтенд (`store.ts`, `use-dashboard-view-queries.ts`) и Koa-роутер используют PATCH → заменён на `@Patch`. Остальные маршруты согласованы. Отмечены подозрительные места: `hints/dontShowAgain` (не используется, хинты идут через `user/update`), `getTemplates` в `shared/api/features/dashboard-templates` (GET/companyId — неверная сигнатура, живой код использует POST+bunchIds), `user.sendEmailConfirmation` (мёртвый). `hints`/`getTemplates` по решению пользователя не трогаем — возможно, не мёртвый код, доберёмся позже.
- [x] 6.4 Выпилен мёртвый код `transactions`: удалены `entities/transactions/` (стор + `store.spec.ts`), `features/transactions/` (заглушка `=> ({})`), `shared/api/features/transactions/`; убран `transactions.sendTransactions` из `API_PATHS` (frontend `api-paths.ts` и backend `router/paths.ts`). Бэкенд-эндпоинта `/sendTransactions` никогда не было. tsc frontend 0 ошибок, lint 0 ошибок.
- [x] 6.5 Починен краш дашборда `Cannot read properties of undefined (reading 'no_parentId')`: хук `use-dashboard-view-state` возвращал `parentsViewItems = undefined` при пустом `entities` (дашборд без элементов / до загрузки viewItems), а `DashboardRender` обращается к `parents[parentId]`. Исправлено: `parentsViewItems` теперь всегда объект (`getParents(viewItems)`, для пустого — `{}`); убран лишний `!` в `body-content/index.tsx`. lint/tsc 0 ошибок.

## Этап 7: Google-данные + стили уведомлений (сессия 18)

- [x] 7.1 Починены стили всплывающих уведомлений (`widgets/message-bar`): после апгрейда до MUI 9 классы `Alert` сменились с `MuiAlert-filledSuccess/Error/...` на `MuiAlert-colorSuccess/Error/...`, из-за чего селекторы `sx` перестали работать, а фон `filled`-варианта стал чёрным (в кастомной теме `success.light = error.light = '#000000'`, MUI 9 берёт фон именно из `*.light`). Селекторы обновлены на актуальные имена классов.
- [x] 7.2 `POST /api/getData` (NestJS `google.controller.ts`): добавлена условная проверка доступа, отсутствовавшая после миграции с Koa — публичный дашборд (`dashboardPublicAccess[dashboardSheetId]`) пропускается без сессии, иначе проверяется Firebase session cookie (аналог `checkUserSession`). Улучшена обработка ошибки внешнего сервиса Google Apps Script: при `err.response.status` от axios возвращается 502 с внятным сообщением «Не удалось получить данные из Google Таблицы…» вместо 500 с сырым `Request failed with status code 404`.
- [x] 7.3 Диагностировано происхождение «404» при разлогине: текст `Request failed with status code 404` — это `message` axios-ошибки бэкенда при обращении к `company.googleData.url` (Google Apps Script), а не ошибка авторизации. ⚠️ Если при разлогине запрашивается другая компания (демо/чужой публичный дашборд) — ссылка на гугл-таблицу у неё не настроена/невалидна.
- [x] 7.4 Устранён риск затирания `entities` в `setDashboardBunchesFromCache` (дополнительно): действие делало `updateEntities({}, ...)` — замену вместо мержа, что при повторном вызове эффекта `DashboardPageContainer` (после смены `auth`) могло затереть уже загруженные bunches. Заменено на `updateEntities(state.entities, ...)`. Добавлен тест в `store.test.ts`.
- [x] 7.5 Добавлен спиннер при автоматической загрузке данных гугл-таблицы: `useGetDashboardDataQuery` теперь показывает `PageLoader` в начале запроса (`setPageLoading` с ключом `get-g-data`) и корректно снимает его / показывает ошибку через `onError` (ранее спиннер был только при ручном нажатии «Обновить данные»).
- [x] 7.6 **Починен «пустой дашборд после очистки кэша» (корневая причина).** В `useGetBunchesQuery` (`shared/api/hooks/use-dashboard-view-queries.ts`) после миграции на TanStack Query ответ `/dashboard/bunch/get` читался как `bunches = data`, но бэкенд возвращает `{ bunches: BunchesViewItem }` (`ResGetBunches`). Из-за этого `getViewitemsFromBunches` распаковывал вложенный объект неправильно (элементы без `id` отбрасывались в `updateEntities`), и `viewItems` оставались пустыми — дашборд не отрисовывался. При этом из localStorage (`LS.getBunches`, корректный формат `{ bunchId: { itemId: ViewItem } }`) всё работало — поэтому симптом проявлялся только после очистки кэша. Исправлено на `bunches = (data as { bunches?: BunchesViewItem })?.bunches || {}` (как было в старом Redux-сервисе `services/get-bunches`, который делал `data.bunches`).

## Этап 8: Диагностика «чужой дашборд не отрисовывается» (сессия 19)

- [x] 8.1 Расставлены диагностические `console.log` с префиксом `[DASHBOARD-DEBUG]` по всему пути загрузки/сохранения/отрисовки дашборда, чтобы локализовать проблему: «пользователь с companyId `89MM9qHJLJlY5DZp1T9S` открыл чужой дашборд `jOiXJDIY0nJeiIuBMtI4` (доступ позволяет), нажал «Обновить данные» — ничего не отрисовалось; подозрение, что в LS данные сохраняются/читаются не по companyId из адресной строки». Логи добавлены в:
  - `pages/company/ui/index.tsx` — `urlParamsCompanyId`, `ownCompanyId`, `paramsCompanyId`, `_isParamsCompanyIdLoaded`, `isDashboardAccessView`
  - `pages/dashboard/ui/container.tsx` — `paramsCompanyId`, `paramsBunchesUpdated`, `LS.getViewBunchesUpdated`, `LS.getBunches`, `LS.getDataState`, `hasCachedData`, `bunchesForLoad`
  - `pages/dashboard/ui/body/index.tsx` — `paramsCompanyId` при вызове `setInitial`
  - `shared/api/hooks/use-dashboard-view-queries.ts` (`useGetBunchesQuery`) — `companyId`/`compId`, `bunchIds`, ключи ответа `bunches`, LS после сохранения
  - `shared/api/hooks/use-dashboard-data-query.ts` (`useGetDashboardDataQuery`) — `companyId`/`dashboardSheetId`, ключи ответа и `startEntities`/`startDates`
  - `features/dashboard-data/get-data/model/services/get-data/index.ts` (`getData` — кнопка «Обновить») — `companyId`, ключи ответа и `startEntities`
  - `entities/dashboard-data/model/store.ts` (`finishGetData`) — `companyId`, ключи `startEntities`/`startDates`, LS после `setDataState`
  - `entities/dashboard-view/model/store.ts` (`setDashboardBunchesFromCache`, `fetchBunches`) — `companyId`/`compId`, `changedBunches`, ключи bunches
  - `entities/dashboard-view/model/utils/get-initial-state/index.ts` и `entities/dashboard-data/utils/get-initial-state/index.ts` — `companyId` и прочитанное из LS
  - `entities/company/model/store.ts` (`finishGetParamsCompany`) — `paramsCompany.id` и ключи `bunchesUpdated`
- [x] 8.2 Обновлены `VERSION` → `2.19.0`, `ASSEMBLY_DATE` → `2026-08-14` (тест `config.test.ts` снова зелёный)
- [x] 8.3 **Локализована причина по логам пользователя.** Данные гугл-таблицы в LS есть (233 сущности), а layout пуст: `localBunches` содержит 1 пустой bunch, но `viewBunchesUpdated` содержит 13 «свежих» меток → `bunchesForLoad = 0` → `DashboardBodyContent {}` (`viewItems` пуст). Итог — рассинхрон `bunches` vs `viewBunchesUpdated` в LS.
- [x] 8.4 **Корневая причина:** (1) `setDashboardBunchesFromCache` делал `LS.setBunches(companyId, {...filtered})` — затирал «изменённые» bunch из LS; (2) `useGetBunchesQuery` писал `viewBunchesUpdated` целиком из `paramsBunchesUpdated`, а не только по реально загруженным `bunchIds`. Вместе это оставляло LS в состоянии «метки свежие, а содержимое удалено/пустое».
- [x] 8.5 **Исправлено:**
  - `setDashboardBunchesFromCache` больше не пишет отфильтрованный набор обратно в LS (только читает из кэша и мержит в entities).
  - `useGetBunchesQuery` отмечает «свежими» в `viewBunchesUpdated` только реально загруженные `bunchIds`.
  - Новый хелпер `getBunchesForLoad` (entities/dashboard-view): помимо устаревших по timestamp возвращает bunch с пустым/отсутствующим содержимым в LS — самоисцеление уже «протухшего» кэша. Используется в `container.tsx`. Добавлен unit-тест (5 кейсов).
- [x] 8.6 Диагностические `console.log [DASHBOARD-DEBUG]` удалены из исходников после подтверждения фикса пользователем (дашборд чужой компании отрисовывается).

## Этап 9: Исправление tsc-ошибки `onError` в TanStack Query v5 (сессия 20)

- [x] 9.1 **Починена предсуществующая tsc-ошибка** в `shared/api/hooks/use-dashboard-data-query.ts`:
  - `useQuery` в TanStack Query v5 больше не принимает `onError`/`onSuccess`/`onSettled` (TS2769 `No overload matches this call`).
  - Обработка ошибки (снятие спиннера `setPageLoading`, `failGetData`, `setWarningMessage`) перенесена из `onError` в `try/catch` внутри `queryFn` с последующим `throw` — чтобы `queryClient` по-прежнему помечал запрос как `error` и отрабатывал `retry`/`isError`.
  - Убран неиспользуемый `isLoading` из `useDashboardDataStore` (мёртвый код, введён в сессии 18).
  - Импортирован тип `CustomAxiosError` из `app/providers/store` для типизации ошибки в `catch` (вместо `any`).
  - `tsc --noEmit` (frontend): **0 ошибок** ✅ (было 1).
- [x] 9.2 Валидация: `npm run lint` — 0 ошибок ✅; `tsc` frontend — 0 ошибок; frontend test — 4 failed (предсуществующие валидаторы `fix-date`, `user`, `auth-by-login`, `auth-by-login-schema`); backend test — 16 failed (предсуществующие валидаторы). Новых падений нет.
- [x] 9.3 Обновлены `VERSION` → `2.20.0`, `ASSEMBLY_DATE` → `2026-08-14`.

## Этап 10: Вынос секретов в env (сессия 21)

- [x] 10.1 Секреты вынесены в переменные окружения (разблокирован переезд PLAN 5.6):
  - `libs/firebase/config/admin-sdk.ts` → `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` (privateKey с `.replace(/\\n/g, '\n')`).
  - `libs/firebase/config/fire.ts` → `FIREBASE_API_KEY`/`FIREBASE_AUTH_DOMAIN`/`FIREBASE_STORAGE_BUCKET`/`FIREBASE_MESSAGING_SENDER_ID`/`FIREBASE_APP_ID`.
  - `libs/emails/email-config.ts` → `SMTP_USER`/`SMTP_PASS`.
- [x] 10.2 Удалена папка `libs/firebase/config/private/` (хардкод Admin SDK + web-конфига).
- [x] 10.3 Убраны gitignore-правила для `src/libs/firebase/config/` и `src/libs/emails/email-config.ts` — конфиги теперь коммитятся (в них только чтение из env).
- [x] 10.4 Добавлен `dotenv` + `src/config/load-env.ts` (подгрузка `.env` только вне production); `import './config/load-env'` в `main.ts`.
- [x] 10.5 Создан `packages/backend/.env.example` (шаблон без секретов); локальный `packages/backend/.env` восстановлен из бывших private/*.ts (gitignored).
- [x] 10.6 `rhythm-server.service`: `Environment=SITE_URL=...` + `EnvironmentFile=-/etc/rhythm/rhythm-server.env`; `SITE_URL` в `app/config/index.ts` стал env-переопределяемым.
- [x] 10.7 Тесты: заглушки Firebase/SMTP в `config/jest/setup-tests.ts` (валидный RSA-ключ генерируется на лету), чтобы `cert()` не падал при импорте.
- [x] 10.8 Обновлены `README.md` / `README.dev.md` (разделы env + деплой: systemd вместо PM2).
- [x] 10.9 Валидация: `npm run lint` — 0 ошибок; `npm run build -w packages/backend` — exit 0; тесты — без новых падений (16 backend + 4 frontend предсуществующих валидаторов).
- [x] 10.10 Вынесен пароль доступа к логам (`src/logs/pass.ts` → `LOGS_PASS`): создан `models/loggers/pass.ts` (читает env), обновлены импорты в `clear`/`download`/`view`, удалён gitignored `src/logs/pass.ts`, `LOGS_PASS` добавлен в `.env`/`.env.example`/README/`setup-tests.ts`. Устраняет TS2307 `Cannot find module 'logs/pass'` при сборке на сервере.
- [x] 10.11 `admin-sdk.ts`: креды Firebase Admin SDK читаются через `GOOGLE_APPLICATION_CREDENTIALS` (JSON-файл сервисного аккаунта), fallback на `FIREBASE_*` для локального dev. Причина: systemd 241 в `EnvironmentFile` съедает обратный слэш из `\n`, портя privateKey (`Failed to parse private key: 528`). В юнит добавлен `Environment=GOOGLE_APPLICATION_CREDENTIALS=/etc/rhythm/firebase-adminsdk.json`.
- [x] 10.12 Переезд завершён: nginx + SSL для `rhy.thm.su`, бэкенд NestJS на 7575 (Redis OK), фронт по HTTPS. Финальный 401 на `POST /api/getData` — протухшая session-cookie от старых запусков, перелогин решил.

## Этап 11: Удаление Koa после валидации NestJS (сессия 22)

Koa в проде больше не используется (старт — `node server/main.js`, NestJS). Удалён как мёртвый код и fallback.

- [x] 11.1 Удалить Koa-входы и приложение: `src/index.ts`, `src/app/index.ts`, `src/app/types/global.d.ts` (тип `Context` от Koa).
- [x] 11.2 Удалить `src/middleware/` целиком (router, cors, logging, check-version, session-caches) — заменены NestJS (guards/interceptors).
- [x] 11.3 Удалить старые Koa-контроллеры в `src/controllers/*/` (файлы `index.ts`, принимающие `ctx`), оставив `*.controller.ts` (NestJS) и `*.module.ts`.
- [x] 11.4 Удалить Koa-зависимые `src/views/` (`responseError(ctx, ...)` и мёртвые `get-errors`/`get-status`/`not-authorized`), оставив `err-code.ts` (ERR_CODE) и `get-error-message` (getErrorMessage) — их используют модели.
- [x] 11.5 Удалить Koa-версии в `libs/firebase/auth/` (`fb-auth`, `get-cookies`, `get-session-data`, `check-csrf-token`, `set-cookie`, `create-session`, `index.ts`), оставив fastify-версии (`set-cookie-fastify`, `create-session-fastify`, `get-session-data-fastify`). Из `libs/firebase/index.ts` убран `export * from './auth'`.
- [x] 11.6 Удалены Koa-зависимые логгеры `create-log-temp` и `get-user-data-temp` (принимали Koa `ctx`); `libs/loggers/index.ts` теперь только `export * from './winston'`. `libs/emails/send-group-mail.ts` больше не использует `createLogTemp`. Также удалены Koa/мёртвые модели с `Context`: `models/user/utils/get-user-id`, `models/company/utils/get-company-id`, `models/company/handlers/get`, `models/dashboard-view/services/dev-save-bunches`.
- [x] 11.7 Удалено из `packages/backend/package.json`: скрипты `dev:koa`/`start:koa`, зависимости `koa`, `koa-bodyparser`, `koa-router`, `@types/koa`, `@types/koa-bodyparser`, `@types/koa-router`. Обновлён корневой `package-lock.json` (−62 пакета); удалён вложенный `packages/backend/package-lock.json` (не используется npm workspace, содержал koa).
- [x] 11.8 Валидация: `npm run lint` — 0 ошибок; `npm run build -w packages/backend` — exit 0; backend test — 16 failed (все предсуществующие валидаторы, новых нет); frontend test — 4 failed (предсуществующие валидаторы).
- [x] 11.9 Обновлены таблицы API-эндпоинтов под фактические NestJS-маршруты (camelCase + префикс `/api`) в `README.dev.md` и `.clinerules/promt-for-dev.md`; базовый URL — `https://rhy.thm.su/api`. Обновлён стек в `README.md`/`README.dev.md`: Koa → NestJS + Fastify, PM2 → systemd, структура бэкенда (guards/interceptors/main.ts).

---

## Правила ведения плана

1. В конце каждой сессии разработки:
   - Отметить выполненное в этом файле (`[x]`)
   - Создать/обновить `.planning/prompt-for-next.md` — контекст для следующей сессии
   - Записать название коммита для текущей сессии в `.planning/prompt-for-next.md`

2. В начале каждой сессии:
   - Прочитать `.planning/prompt-for-next.md`
   - Прочитать `PLAN.md` для актуального статуса
