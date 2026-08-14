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
npm run dev -w packages/backend    # Бэкенд (Koa, порт 7575)
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
│   ├── backend/           # API-сервер (Koa + TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/  # Auth, Company, Dashboard, User, Partner, ...
│   │   │   ├── models/       # Бизнес-логика, работа с Firestore
│   │   │   ├── middleware/    # Аутентификация, логирование, роутинг
│   │   │   ├── libs/         # Firebase, Redis, Email, Валидаторы
│   │   │   ├── views/        # Шаблоны ответов
│   │   │   └── index.ts      # Точка входа
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

| Слой               | Технология                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Фронтенд**       | React 18, TypeScript (strict), Vite, MUI 7, Redux Toolkit, React Router 6, Chart.js, Highcharts |
| **Бэкенд**         | Koa, TypeScript (strict), Firebase Admin SDK, Redis, Winston                                    |
| **База данных**    | Firebase Firestore                                                                              |
| **Аутентификация** | Firebase Auth (email/пароль)                                                                    |
| **Деплой**         | VPS + PM2 + Nginx                                                                               |
| **Качество кода**  | ESLint, Prettier, Husky, lint-staged                                                            |

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
- Управление состоянием: Redux Toolkit (локальное), TanStack Query (серверное — в будущем)
- Обработка состояний компонентов: **loading, empty, error, disabled** — всегда
- Доступность (WCAG AA): семантическая вёрстка, клавиатурная навигация, контрастность
- Адаптивность: mobile-first
- Lazy loading: страницы (React.lazy + Suspense), компоненты (React.lazy), изображения (loading="lazy")
- SVG как React-компонент: `import Foo from './foo.svg?react'`

### Backend (Node.js / Koa)

- Все данные от клиента валидируются на бэке (AJV)
- Единый формат ошибок API
- Rate limiting на эндпоинтах
- Middleware верификации Firebase-токена на каждом защищённом эндпоинте

### База данных (Firestore)

- Составные индексы для частых запросов
- Security Rules: минимально необходимые права для каждой роли

---

## Команды разработки

```bash
# Запуск
npm run dev -w packages/frontend    # Фронтенд (Vite, порт 3000)
npm run dev -w packages/backend     # Бэкенд (Koa, порт 7575)

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

Базовый URL: `https://api.rhy.thm.su`

| Метод | Эндпоинт                     | Описание                                    |
| ----- | ---------------------------- | ------------------------------------------- |
| POST  | `/auth/login`                | Вход                                        |
| POST  | `/auth/signup`               | Регистрация                                 |
| POST  | `/auth/reset-email-password` | Сброс пароля                                |
| GET   | `/company/get`               | Получение данных компании                   |
| POST  | `/company/update`            | Обновление данных компании                  |
| POST  | `/company/delete-sheet`      | Удаление листа                              |
| GET   | `/dashboard/view`            | Просмотр дашборда                           |
| POST  | `/dashboard/bunch`           | Операции с группами элементов               |
| GET   | `/docs/get-policy`           | Получение политики                          |
| GET   | `/google/get-data`           | Получение данных из Google Sheets           |
| GET   | `/loggers/view`              | Просмотр логов                              |
| GET   | `/loggers/download`          | Скачивание логов                            |
| POST  | `/loggers/clear`             | Очистка логов                               |
| GET   | `/params-company/get`        | Получение параметров компании               |
| POST  | `/partner/increase-follower` | Увеличение счётчика последователей партнёра |
| POST  | `/templates/delete`          | Удаление шаблона                            |

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

### Frontend

| Переменная     | По умолчанию            | Назначение                                                |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:7575` | URL бэкенда для dev-прокси Vite (в проде не используется) |

Пример задания переменной локально (если не используется `.env`):

```bash
SMTP_USER=you@mail.com SMTP_PASS=... npm run dev -w packages/backend
```

---

## Деплой

### Окружения

- **Dev:** локальная разработка (localhost)
- **Stage:** тестовый сервер
- **Prod:** боевой сервер

### Деплой на VPS

Бэкенд запускается через systemd (`rhythm-server.service`), фронтенд раздаётся Nginx из
`packages/frontend/build/`. Полный сценарий — в `packages/frontend/deploy.sh`.

```bash
# 1. Разово: создать файл секретов на сервере (права 600)
#    /etc/rhythm/rhythm-server.env — по шаблону packages/backend/.env.example

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

### Docker Compose (Firebase эмуляторы)

```bash
docker compose up -d
```

Запускает Firebase Auth, Firestore, Storage эмуляторы для локальной разработки.
