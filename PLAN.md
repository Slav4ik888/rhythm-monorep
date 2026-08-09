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
- [ ] 2.3 Smoke-тесты для ключевых страниц
- [x] 2.4 `npm test -w packages/backend` — проходит
- [x] 2.5 `npm test -w packages/frontend` — проходит

## Этап 3: Технологические улучшения

- [ ] 3.1 React 18 → React 19 (установлены пакеты, исправлен JSX namespace)
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
- [ ] 3.3.7 Мигрировать entities/dashboard-templates (197 строк, высокая сложность, дерево + LS)
  - Порядок: unit-тесты на Redux-слайс → Zustand-стор с теми же тестами → замена в компонентах → удалить Redux
- [ ] 3.3.8 Мигрировать entities/dashboard-view (390 строк, очень высокая сложность, bunches + LS)
  - Порядок: unit-тесты на Redux-слайс → Zustand-стор с теми же тестами → замена в компонентах → удалить Redux
- [ ] 3.3.9 Мигрировать страничные сторы (login, signup)
- [ ] 3.3.10 Убрать Redux Provider из app/providers, удалить зависимости
- [ ] 3.4 TanStack Query для серверного состояния (пакет установлен, интеграция не выполнена)
- [x] 3.5 PWA (vite-plugin-pwa + workbox)
- [ ] 3.6 Koa → NestJS + Fastify
- [x] 3.7 Docker Compose для Firebase эмуляторов
- [x] 3.8 Husky + lint-staged
- [x] 3.9 README.dev.md с глоссарием доменных терминов
- [x] 3.10 Обновление MUI до актуальной версии (v7.2.0 → v9.3.1, @mui/lab v9 beta, tsc 0 ошибок, линтер 1714 → 89 ошибок)

## Этап 4: Изменение формата получения данных из гугл таблицы

- [ ] 4.1 Надо рассмотреть другие варианты, не как сейчас, через скрипты

---

## Правила ведения плана

1. В конце каждой сессии разработки:
   - Отметить выполненное в этом файле (`[x]`)
   - Создать/обновить `.planning/prompt-for-next.md` — контекст для следующей сессии
   - Записать название коммита для текущей сессии в `.planning/prompt-for-next.md`

2. В начале каждой сессии:
   - Прочитать `.planning/prompt-for-next.md`
   - Прочитать `PLAN.md` для актуального статуса
