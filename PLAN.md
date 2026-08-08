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

- [ ] 3.1 React 18 → React 19
- [ ] 3.2 React Router 6 → React Router 7
- [ ] 3.3 Redux Toolkit → Zustand
- [ ] 3.4 TanStack Query для серверного состояния
- [x] 3.5 PWA (vite-plugin-pwa + workbox)
- [ ] 3.6 Koa → NestJS + Fastify
- [x] 3.7 Docker Compose для Firebase эмуляторов
- [x] 3.8 Husky + lint-staged
- [x] 3.9 README.dev.md с глоссарием доменных терминов
- [ ] 3.10 Обновление MUI до актуальной версии (v7.2.0 → v9.3.1, крупная миграция)

---

## Правила ведения плана

1. В конце каждой сессии разработки:
   - Отметить выполненное в этом файле (`[x]`)
   - Создать/обновить `.planning/prompt-for-next.md` — контекст для следующей сессии
   - Записать название коммита для текущей сессии в `.planning/prompt-for-next.md`

2. В начале каждой сессии:
   - Прочитать `.planning/prompt-for-next.md`
   - Прочитать `PLAN.md` для актуального статуса
