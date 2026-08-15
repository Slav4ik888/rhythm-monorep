# README.dev.md — Техническое руководство для разработчиков «Ритм»

## Оглавление

- [Быстрый старт](#быстрый-старт)
- [Архитектура проекта](#архитектура-проекта)
- [Глоссарий доменных терминов](#глоссарий-доменных-терминов)
- [Соглашения по коду](#соглашения-по-коду)
- [Команды разработки](#команды-разработки)
- [Структура базы данных (Firestore)](#структура-базы-данных-firestore)
- [API эндпоинты](#api-эндпоинты)
- [Переменные окружения](#переменные-окружения)
- [PWA / Service Worker](#pwa--service-worker)
- [Технический долг и мёртвый код](#технический-долг-и-мёртвый-код)
- [E2E-тесты (Playwright)](#e2e-тесты-playwright)
- [Деплой](#деплой)

---

## Быстрый старт

```bash
# 1. Клонирование
git clone <repo-url>
cd rhythm

# 2. Установка зависимостей (включая husky)
npm install

# 3. Запуск
npm run dev -w packages/frontend   # Фронтенд (Vite, порт 3000)
npm run dev -w packages/backend    # Бэкенд (NestJS, порт 7575)
```

После запуска:

- **Фронтенд:** http://localhost:3000
- **Бэкенд API:** http://localhost:7575

---

## Архитектура проекта

```
rhythm/
├── packages/
│   ├── frontend/          # React SPA (Vite) — Feature-Sliced Design
│   │   ├── src/
│   │   │   ├── app/       # Глобальные провайдеры, роутинг, стили
│   │   │   ├── pages/     # Страницы (dashboard, company, login, signup, ...)
│   │   │   ├── widgets/   # Композиционные блоки (sidebar, navbar, footer, ...)
│   │   │   ├── features/  # Бизнес-фичи (auth, dashboard, user, partner, ...)
│   │   │   ├── entities/  # Бизнес-сущности (company, user, charts, blocks, ...)
│   │   │   ├── shared/    # Переиспользуемые модули (api, ui, helpers, lib, ...)
│   │   │   └── index.tsx  # Точка входа
│   │   ├── public/        # Статические файлы
│   │   ├── vite.config.ts
│   │   └── package.json
│   ├── backend/           # API-сервер (NestJS + Fastify + TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/  # Auth, Company, Dashboard, User, Partner, ... (NestJS)
│   │   │   ├── models/       # Бизнес-логика, работа с Firestore
│   │   │   ├── guards/       # FirebaseAuthGuard (верификация сессии)
│   │   │   ├── interceptors/ # Логирование запросов
│   │   │   ├── libs/         # Firebase, Redis, Email, Валидаторы
│   │   │   └── main.ts       # Точка входа
│   │   └── package.json
│   └── shared/            # Общие типы и валидаторы
│       └── package.json
├── .husky/                # Git hooks (pre-commit: lint-staged)
├── .clinerules/           # Правила для AI-агента
├── .planning/             # Планирование и архитектурная документация
├── PLAN.md                # План реорганизации проекта
├── README.md              # Пользовательская документация
├── README.dev.md          # Этот файл — техническое руководство
└── package.json           # Корневой (workspaces)
```

### Стек технологий

| Слой               | Технология                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------- |
| **Фронтенд**       | React 19, TypeScript (strict), Vite, MUI 9, Zustand, React Router 7, Chart.js, Highcharts |
| **Бэкенд**         | NestJS + Fastify, TypeScript (strict), Firebase Admin SDK, Redis, Winston                 |
| **База данных**    | Firebase Firestore                                                                        |
| **Аутентификация** | Firebase Auth (email/пароль)                                                              |
| **Деплой**         | VPS + systemd + Nginx                                                                     |
| **Качество кода**  | ESLint, Prettier, Husky, lint-staged                                                      |

### Хранение данных на клиенте (localStorage + IndexedDB)

Загруженные данные дашборда делятся на «лёгкие» и «тяжёлые»:

- **localStorage** (`shared/lib/local-storage`, префикс `Rhythm-`) — мелкое UI-состояние и флаги:
  cookie, `partnerId`, `hintsDontShowAgain`, `lastCompanyId`, `editMode-*`, `UIConfiguratorState`,
  `paramsCompany`, `templates`, `templatesBunchesUpdated`, `userState-*`, `companyState-*`.
- **IndexedDB** (`shared/lib/indexed-db`, БД `rhythm-heavy-data`, стор `kv`) — «тяжёлые» per-company данные:
  `dataState-*` (данные гугл-таблицы), `bunches-*` (view-элементы дашборда), `viewBunchesUpdated-*`,
  `Dashboard-GSData-*` (dev-сырые данные `/api/getData`). Причина: квота localStorage ~5 МБ исчерпывалась
  при загрузке данных нескольких компаний.

Реализация — **синхронный фасад `HeavyStorage`** (`shared/lib/indexed-db/storage.ts`):
in-memory `Map` для мгновенного синхронного чтения + асинхронная персистентность в IndexedDB через очередь
записи. Это сохраняет синхронные сигнатуры `LS.getBunches/getDataState/...` (они используются в Zustand-сторах,
`useMemo` и `getInitialState`) и не требует размазывать `await` по приложению.

- Инициализация: `LS.initHeavyStorage()` в `src/index.tsx` до `root.render` — сначала однократная миграция
  существующих «тяжёлых» ключей из localStorage в IndexedDB (`migrateHeavyFromLocalStorage`), затем
  `HeavyStorage.hydrate()` (загрузка всех ключей в память).
- Очистка: `LS.clearStorage()` (async) чистит и localStorage, и IndexedDB.
- Кросс-вкладочная синхронизация: IndexedDB не генерирует localStorage-событие `storage`, поэтому
  изменения «тяжёлых» ключей транслируются другим вкладкам через `BroadcastChannel`
  (`shared/lib/indexed-db/broadcast.ts`, канал `rhythm-heavy-data-sync`). `HeavyStorage.set/remove/clear`
  шлют сообщение `{ type, key, value? }`, принимающая вкладка обновляет in-memory кеш и диспатчит
  `storage`-событие для локальных подписчиков. Подписка включается в `LS.initHeavyStorage()`
  (`HeavyStorage.startSync()`). Same-tab синхронизация осталась на ручном
  `window.dispatchEvent(new Event('storage'))` (BroadcastChannel не доставляет сообщение отправителю).

---

## Глоссарий доменных терминов

**Обязательно использовать эти термины в коде, комментариях и документации. Не заменять синонимами.**

### Сущности и поля

| Термин        | Описание                         |
| ------------- | -------------------------------- |
| `User`        | Пользователь системы             |
| `Company`     | Компания (организация)           |
| `Dashboard`   | Дашборд (информационная панель)  |
| `Partner`     | Партнёр реферальной программы    |
| `Template`    | Шаблон дашборда                  |
| `Transaction` | Транзакция (финансовая операция) |

### Роли

| Роль          | Описание                    |
| ------------- | --------------------------- |
| `Super admin` | Супер-администратор системы |
| `Developer`   | Разработчик                 |
| `Owner`       | Владелец компании           |
| `Employee`    | Сотрудник компании          |

### Коллекции Firestore

| Коллекция      | Назначение                       |
| -------------- | -------------------------------- |
| `users`        | Пользователи системы             |
| `companies`    | Компании (организации)           |
| `dashboards`   | Дашборды и их view               |
| `templates`    | Шаблоны дашбордов                |
| `partners`     | Партнёры реферальной программы   |
| `transactions` | Транзакции (финансовые операции) |
| `docs`         | Документы (политики, оферты)     |
| `logs`         | Логи действий                    |

### Маршруты (страницы)

| Маршрут            | Страница                                |
| ------------------ | --------------------------------------- |
| `/`                | Главная (редирект на дашборд или логин) |
| `/login`           | Вход                                    |
| `/signup`          | Регистрация                             |
| `/dashboard`       | Дашборд (редактор и просмотр)           |
| `/company`         | Управление компанией                    |
| `/company-profile` | Профиль компании                        |
| `/user-profile`    | Личный кабинет пользователя             |
| `/policy`          | Политика конфиденциальности             |
| `/demo`            | Демо-режим                              |
| `/not-access`      | Нет доступа (403)                       |
| `/not-found`       | Страница не найдена (404)               |

### Типы дашборд-элементов

| Тип     | Описание                |
| ------- | ----------------------- |
| `Block` | Блок/виджет на дашборде |
| `Chart` | График/диаграмма        |
| `Sheet` | Лист (вкладка дашборда) |
| `View`  | Представление дашборда  |
| `Bunch` | Группа элементов        |

---

## Соглашения по коду

### Общие правила

- **Язык:** TypeScript (strict mode) — никакого `any` без крайней необходимости
- **Именование:** использовать только термины из глоссария
- **Комментарии:** на русском языке, описывать «почему», а не «что»
- **Формат:** ESLint + Prettier, проверка перед каждым коммитом (Husky + lint-staged)

### Frontend (React / Vite)

- Функциональные компоненты, хуки
- Управление состоянием: Zustand (локальное), TanStack Query (серверное)
- Обработка состояний компонентов: **loading, empty, error, disabled** — всегда
- Доступность (WCAG AA): семантическая вёрстка, клавиатурная навигация, контрастность
- Адаптивность: mobile-first
- Lazy loading: страницы (React.lazy + Suspense), компоненты (React.lazy), изображения (loading="lazy")
- SVG как React-компонент: `import Foo from './foo.svg?react'`

### Backend (Node.js / NestJS + Fastify)

- Все данные от клиента валидируются на бэке (AJV)
- Единый формат ошибок API
- Rate limiting на эндпоинтах
- Верификация Firebase-токена на каждом защищённом эндпоинте (FirebaseAuthGuard)

### База данных (Firestore)

- Составные индексы для частых запросов
- Security Rules: минимально необходимые права для каждой роли

---

## Команды разработки

```bash
# Запуск (всё вместе): бэкенд стартует первым, фронтенд — после готовности порта 7575
npm run dev                          # обёртка над dev.sh (wait-on tcp:7575)

# Или по отдельности (сначала бэкенд, дождаться «Listening on port 7575», потом фронтенд)
npm run dev -w packages/backend     # Бэкенд (NestJS, порт 7575)
npm run dev -w packages/frontend    # Фронтенд (Vite, порт 3000)

# Сборка
npm run build -w packages/frontend  # Фронтенд (production)
npm run build -w packages/backend   # Бэкенд (TypeScript → JavaScript)

# Тестирование
npm test -w packages/frontend       # Все тесты фронтенда
npm test -w packages/backend        # Все тесты бэкенда

# Линтер
npm run lint                        # ESLint (max-warnings 0)
npm run lint:fix                    # ESLint с авто-исправлением

# Форматирование
npm run format                      # Prettier
npm run format:check                # Prettier (только проверка)
```

### Сборка бэкенда и build-артефакты

- `packages/backend/server/` — результат `npm run build -w packages/backend` (gitignored build-артефакт, не коммить).
- После локальной сборки в `server/` попадают скомпилированные `*.test.js` (тесты, лежащие вне папок `tests/`); jest игнорирует их через `testPathIgnorePatterns: ['/node_modules/', '/shared/', '/server/']` (`packages/backend/config/jest/jest.config.ts`).
- При необходимости чистая сборка: `rm -rf packages/backend/server && npm run build -w packages/backend` (в `deploy.sh` очистка `server/` уже выполняется).

---

## Структура базы данных (Firestore)

### Коллекция `users`

```
users/{uid}
  ├── email: string
  ├── displayName: string
  ├── role: 'super_admin' | 'owner' | 'employee' | 'developer'
  ├── companyId: string (ref → companies)
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp
```

### Коллекция `companies`

```
companies/{companyId}
  ├── name: string
  ├── ownerId: string (ref → users)
  ├── settings: object
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp
```

### Коллекция `dashboards`

```
dashboards/{dashboardId}
  ├── companyId: string (ref → companies)
  ├── name: string
  ├── sheets: Sheet[]
  ├── views: View[]
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp
```

### Коллекция `partners`

```
partners/{partnerId}
  ├── userId: string (ref → users)
  ├── referralCode: string
  ├── followers: number
  ├── bonuses: number
  ├── createdAt: Timestamp
  └── updatedAt: Timestamp
```

---

## API эндпоинты

Базовый URL: `https://rhy.thm.su/api` (локально — `http://localhost:7575/api`).

Все маршруты объявлены в NestJS с префиксом `api` (`@Controller('api')`), поэтому фактический
путь всегда начинается с `/api`. Nginx проксирует `location /api/` → `127.0.0.1:7575` без
срезания префикса.

| Метод | Эндпоинт                               | Описание                                    |
| ----- | -------------------------------------- | ------------------------------------------- |
| POST  | `/api/auth/login/byEmail`              | Вход по email                               |
| POST  | `/api/auth/signup/byEmailStart`        | Начало регистрации (по email)               |
| POST  | `/api/auth/signup/sendCodeAgain`       | Повторная отправка кода подтверждения       |
| POST  | `/api/auth/signup/byEmailEnd`          | Завершение регистрации                      |
| POST  | `/api/auth/login/resetEmailPassword`   | Сброс пароля                                |
| GET   | `/api/user/getAuth`                    | Получение данных пользователя и компании    |
| POST  | `/api/user/update`                     | Обновление данных пользователя              |
| POST  | `/api/user/logout`                     | Выход (очистка cookie + редирект)           |
| POST  | `/api/company/update`                  | Обновление данных компании                  |
| POST  | `/api/company/deleteSheet`             | Удаление листа                              |
| GET   | `/api/paramsCompany/get`               | Получение параметров компании               |
| POST  | `/api/paramsCompany/get`               | Получение параметров компании               |
| POST  | `/api/dashboard/bunch/get`             | Получение групп элементов дашборда          |
| POST  | `/api/dashboard/view/createGroupItems` | Создание элементов дашборда                 |
| PATCH | `/api/dashboard/view/update`           | Обновление элементов дашборда               |
| POST  | `/api/dashboard/view/delete`           | Удаление элементов дашборда                 |
| GET   | `/api/templates/getBunchesUpdated`     | Получение обновлённых групп шаблонов        |
| POST  | `/api/templates/getTemplates`          | Получение шаблонов                          |
| POST  | `/api/templates/update`                | Обновление шаблона                          |
| POST  | `/api/templates/delete`                | Удаление шаблона                            |
| GET   | `/api/getPolicy`                       | Получение политики конфиденциальности       |
| POST  | `/api/getData`                         | Получение данных из Google Sheets           |
| POST  | `/api/increaseFollower`                | Увеличение счётчика последователей партнёра |
| GET   | `/api/logs/view/:name/:pass`           | Просмотр логов                              |
| GET   | `/api/logs/download/:name/:pass`       | Скачивание логов                            |
| GET   | `/api/logs/clear/:name/:pass`          | Очистка логов                               |

---

## Переменные окружения

Секреты (Firebase Admin SDK, web-конфиг Firebase, SMTP) хранятся **вне репозитория** и читаются
из переменных окружения (`process.env`).

- **Локально:** скопируй `packages/backend/.env.example` → `packages/backend/.env` и заполни значения.
  В dev/test-режиме `.env` подхватывается автоматически (см. `packages/backend/src/config/load-env.ts`).
- **На сервере:** переменные задаются через systemd (`EnvironmentFile=/etc/rhythm/rhythm-server.env`,
  см. `packages/backend/rhythm-server.service`). В production `.env` не читается.

### Backend

| Переменная                     | По умолчанию             | Назначение                                                                                            |
| ------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `PORT`                         | `7575`                   | порт API-сервера                                                                                      |
| `NODE_ENV`                     | `development`            | `development` / `test` / `production`. В production при недоступном Redis сервер завершится с ошибкой |
| `REDIS_URL`                    | `redis://localhost:6379` | адрес Redis                                                                                           |
| `SITE_URL`                     | `https://rhy.thm.su`     | публичный URL сайта (CORS, ссылки в письмах)                                                          |
| `FIREBASE_PROJECT_ID`          | —                        | Firebase Admin SDK: projectId                                                                         |
| `FIREBASE_CLIENT_EMAIL`        | —                        | Firebase Admin SDK: clientEmail (service account)                                                     |
| `FIREBASE_PRIVATE_KEY`         | —                        | Firebase Admin SDK: privateKey (переносы строк — литеральные `\n`)                                    |
| `FIREBASE_API_KEY`             | —                        | Firebase web-конфиг: apiKey                                                                           |
| `FIREBASE_AUTH_DOMAIN`         | —                        | Firebase web-конфиг: authDomain                                                                       |
| `FIREBASE_STORAGE_BUCKET`      | —                        | Firebase web-конфиг: storageBucket                                                                    |
| `FIREBASE_MESSAGING_SENDER_ID` | —                        | Firebase web-конфиг: messagingSenderId                                                                |
| `FIREBASE_APP_ID`              | —                        | Firebase web-конфиг: appId                                                                            |
| `SMTP_USER`                    | —                        | логин SMTP для отправки писем                                                                         |
| `SMTP_PASS`                    | —                        | пароль SMTP                                                                                           |
| `LOGS_PASS`                    | —                        | пароль доступа к логам (`/loggers/*`)                                                                 |

### Frontend

| Переменная     | По умолчанию            | Назначение                                                |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:7575` | URL бэкенда для dev-прокси Vite (в проде не используется) |

Пример задания переменной локально (если не используется `.env`):

```bash
SMTP_USER=you@mail.com SMTP_PASS=... npm run dev -w packages/backend
```

---

## PWA / Service Worker

- **`index.html` НЕ прекэшируется.** В `packages/frontend/vite.config.ts` (vite-plugin-pwa/workbox): `globPatterns` без `html` + `globIgnores: ['**/index.html']` + `navigateFallback: null`, навигация через `NetworkFirst` (свежий `index.html` из сети, кэш — только офлайн).
- **Не возвращай дефолтный `navigateFallback`** — иначе SW снова начнёт раздавать прекэшированный `index.html` (баг «вечная старая версия» после деплоя). Пользователям со старым SW нужен разовый сброс кэша: DevTools → Application → Clear site data / Unregister SW.
- При рассинхроне версии (409 от `CheckVersionInterceptor`) фронт снимает регистрацию SW и чистит кэш перед `reload` (см. `shared/api/api.ts`).

## Технический долг и мёртвый код

- `packages/backend/src/libs/loggers/winston/index.ts`: `loggerServer` не используется (после удаления Koa `app/index.ts`); `loggerApp` используется — в `CheckVersionInterceptor`.
- `packages/backend/src/libs/firebase/auth/get-session-data-fastify.ts` — не используется (FirebaseAuthGuard реализует свою `extractSessionCookie`); кандидат на удаление.
- Вложенный `packages/frontend/package-lock.json` — артефакт до монорепо, можно удалить (как ранее был удалён backend-вариант).

## E2E-тесты (Playwright)

Сквозные smoke-тесты браузером. Расположение — `e2e/`, конфиг — `playwright.config.ts` (корень).

- **Проекты:** `guest` (`e2e/guest/`), `customer` (`e2e/customer/`),
  `admin` (`e2e/admin/`) — по ролям пользователей.
- **Бэкенд и Firebase не требуются.** `webServer` поднимает только Vite dev-сервер
  (`npm run dev -w packages/frontend`, порт 3000). Guest-страницы переживают 500 от `getAuth`/`getPolicy`
  (graceful error handling).
- **Авторизация мокается** перехватом `GET /api/user/getAuth` через `page.route()` — см.
  `e2e/helpers/mock-auth.ts` (`createE2eUser`, `createE2eCompany`, `mockAuth(page)`); формат ответа
  `{ userData, companyData }` = `ResGetAuth` фронтенда. Для дашборда дополнительно заглушается
  `**/api/getData` (пустой `{}`).
- **Особенность роутинга:** путь из одного сегмента (`/non-existent-page`) ловится роутом `:companyId`
  (страница чужой компании), а не `*` (404). Для 404 используй многосегментный путь.
- **Запуск:** `npm run test:e2e` (или `npx playwright test`; отдельный проект — `--project=guest|customer|admin`).

### Наборы E2E-тестов

| Файл                           | Покрытие                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `e2e/guest/pages.spec.ts`      | Статические страницы гостя (главная, вход, регистрация, политика, демо, 404) — 7 тестов                                            |
| `e2e/guest/auth.spec.ts`       | Вход (успех/валидация), восстановление пароля, полный сценарий регистрации (код → перенаправление) — 4 теста                       |
| `e2e/guest/referral.spec.ts`   | Реферальная программа `?ref=` (увеличение счётчика, невалидный код, идемпотентность, передача `partnerId` в регистрацию) — 4 теста |
| `e2e/guest/pwa.spec.ts`        | PWA: веб-манифест, ссылка на манифест, регистрация Service Worker — 3 теста                                                        |
| `e2e/customer/profile.spec.ts` | Личный кабинет (рендер данных / редирект неавторизованного) — 2 теста                                                              |
| `e2e/admin/dashboard.spec.ts`  | Профиль компании и дашборд владельца — 2 теста                                                                                     |

Примечание про «реальные» сценарии входа/регистрации: фронтенд делегирует аутентификацию бэкенду
(`/api/auth/*`), поэтому сквозной флоу покрывается моками ответов `page.route()`. Полный сценарий против
реального бэкенда + Firebase Auth-эмуляторов (`docker-compose.yml`) + сидов — отдельная задача, требующая
поднятого стека (Auth/Firestore/Redis эмуляторы, seed-данные).

## Деплой

### Окружения

- **Dev:** локальная разработка (localhost)
- **Stage:** тестовый сервер
- **Prod:** боевой сервер

### Деплой на VPS

Бэкенд запускается через systemd (`rhythm-server.service`), фронтенд раздаётся Nginx из
`packages/frontend/build/`. Полный сценарий — в `deploy.sh` (корень репозитория).

```bash
# 1. Разово: создать файлы секретов на сервере (права root:root 600)
#    /etc/rhythm/rhythm-server.env      — web-конфиг Firebase, SMTP, LOGS_PASS
#                                         (по шаблону packages/backend/.env.example)
#    /etc/rhythm/firebase-adminsdk.json — JSON сервисного аккаунта Firebase (Admin SDK)

# 2. Деплой (в каталоге монорепозитория)
cd /var/www/vtempe/data/rhythm2
git pull
npm install
npm run build -w packages/backend      # TypeScript → packages/backend/server/
npm run build -w packages/frontend     # Vite → packages/frontend/build/

# 3. Перезапуск бэкенда
systemctl daemon-reload
systemctl restart rhythm-server
```

### Серверная инфраструктура (prod)

- **systemd-юнит живёт в `/etc/systemd/system/rhythm-server.service`** (НЕ в каталоге проекта,
  чтобы не зависеть от папки репозитория). Источник — `packages/backend/rhythm-server.service`.
  При каждом полном деплое `deploy.sh` сам копирует его в `/etc/systemd/system/` (шаг
  `sync_service_file`) и выполняет `daemon-reload`.
- **Секреты** хранятся вне репозитория, в каталоге `/etc/rhythm/`:
  - `rhythm-server.env` — `FIREBASE_*` (web-конфиг), `SMTP_USER/SMTP_PASS`, `LOGS_PASS`
    (читает systemd через `EnvironmentFile=`).
  - `firebase-adminsdk.json` — JSON сервисного аккаунта Firebase Admin SDK (читает
    `GOOGLE_APPLICATION_CREDENTIALS`). privateKey нельзя держать в `EnvironmentFile`: systemd
    (≥240) съедает обратный слэш из `\n` и портит ключ.
- **Nginx** — конфиг `packages/backend/rhy.thm.su` (`/api/` → `127.0.0.1:7575`, SPA-fallback на
  `/index.html`). На сервере ставится в `/etc/nginx/sites-available/` + symlink в
  `sites-enabled/` (или через панель ISPmanager).

### Docker Compose (Firebase эмуляторы)

```bash
docker compose up -d
```

Запускает Firebase Auth, Firestore, Storage эмуляторы для локальной разработки.
