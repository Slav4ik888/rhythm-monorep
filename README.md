# Ритм — Информационная панель руководителя

PWA-приложение для визуализации бизнес-данных: дашборды, отчёты, аналитика, реферальная программа.

## Содержание

- [Требования](#требования)
- [Быстрый старт (локально)](#быстрый-старт-локально)
- [Структура проекта](#структура-проекта)
- [Переменные окружения](#переменные-окружения)
- [Команды разработки](#команды-разработки)
- [Стек технологий](#стек-технологий)
- [Документация](#документация)

---

## Требования

| Инструмент | Версия |
| ---------- | ------ |
| Node.js    | 20+    |
| npm        | 10+    |

---

## Быстрый старт (локально)

```bash
# 1. Клонирование
git clone <repo-url>
cd rhythm

# 2. Установка зависимостей
npm install

# 3. Запуск
npm run dev -w packages/frontend   # Фронтенд (Vite, порт 3000)
npm run dev -w packages/backend    # Бэкенд (NestJS, порт 7575)
```

После запуска:

- **Фронтенд:** http://localhost:3000
- **Бэкенд API:** http://localhost:7575

---

## Структура проекта

```
rhythm/
├── packages/
│   ├── frontend/          # React SPA (Vite)
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
├── .clinerules/           # Правила для AI-агента
├── .planning/             # Планирование и архитектурная документация
├── PLAN.md                # План реорганизации проекта
├── package.json           # Корневой (workspaces)
└── README.md              # Этот файл
```

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

## Команды разработки

```bash
# Запуск
npm run dev -w packages/frontend    # Фронтенд (Vite)
npm run dev -w packages/backend     # Бэкенд

# Сборка
npm run build -w packages/frontend  # Фронтенд (production)
npm run build -w packages/backend   # Бэкенд (TypeScript → JavaScript)

# Тестирование
npm test -w packages/frontend
npm test -w packages/backend

# Линтер
npm run lint
npm run lint:fix
```

---

## Стек технологий

- **Фронтенд:** React 19, TypeScript, Vite, MUI 9, Zustand, React Router 7, Chart.js, Highcharts
- **Бэкенд:** NestJS + Fastify, TypeScript, Firebase Admin SDK, Redis, Winston
- **База данных:** Firebase Firestore
- **Аутентификация:** Firebase Auth (email/пароль)
- **Деплой:** VPS + systemd + Nginx

---

## Документация

- [План реорганизации](PLAN.md)
- [Правила для AI-агента](.clinerules/)
- [Архитектурная документация](.planning/)
