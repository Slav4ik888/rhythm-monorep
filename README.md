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
npm run dev -w packages/backend    # Бэкенд (Koa, порт 7575)
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
├── .clinerules/           # Правила для AI-агента
├── .planning/             # Планирование и архитектурная документация
├── PLAN.md                # План реорганизации проекта
├── package.json           # Корневой (workspaces)
└── README.md              # Этот файл
```

---

## Переменные окружения

Проект **не использует `.env`-файл**. Настройки читаются напрямую из окружения процесса
(`process.env`) и задаются через shell, systemd (`Environment=`), PM2 (ecosystem-файл) и т.п.

> ⚠️ Firebase-конфиг (Admin SDK + web-конфиг) и SMTP-доступы пока захардкожены в исходниках
> (`packages/backend/src/libs/firebase/config/`, `packages/backend/src/libs/emails/email-config.ts`) —
> это техдолг, который предстоит вынести в переменные окружения.

### Backend

| Переменная  | По умолчанию             | Назначение                                                                                            |
| ----------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `PORT`      | `7575`                   | порт API-сервера                                                                                      |
| `NODE_ENV`  | —                        | `development` / `test` / `production`. В production при недоступном Redis сервер завершится с ошибкой |
| `REDIS_URL` | `redis://localhost:6379` | адрес Redis                                                                                           |

### Frontend

| Переменная     | По умолчанию            | Назначение                                                |
| -------------- | ----------------------- | --------------------------------------------------------- |
| `VITE_API_URL` | `http://localhost:7575` | URL бэкенда для dev-прокси Vite (в проде не используется) |

Пример задания переменной локально:

```bash
REDIS_URL=redis://localhost:6379 npm run dev -w packages/backend
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
- **Бэкенд:** Koa, TypeScript, Firebase Admin SDK, Redis, Winston
- **База данных:** Firebase Firestore
- **Аутентификация:** Firebase Auth (email/пароль)
- **Деплой:** VPS + PM2 + Nginx

---

## Документация

- [План реорганизации](PLAN.md)
- [Правила для AI-агента](.clinerules/)
- [Архитектурная документация](.planning/)
