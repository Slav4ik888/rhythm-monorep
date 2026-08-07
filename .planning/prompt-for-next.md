# Контекст для следующей сессии

## Дата
07.08.2026

## Контекст: что сделано в этой сессии
- **Этап 0 завершён:**
  - Создан `PLAN.md` — план реорганизации проекта (4 этапа, разбиты на подзадачи)
  - Создан `README.md` — описание проекта, структура, команды разработки
  - Обновлён `.clinerules/promt-for-dev.md` — добавлено правило завершения сессии (PLAN.md + prompt-for-next.md + коммит)
  - Обновлён `.clinerules/test-policy.md` — заполнены шаблоны актуальной структурой
  - Создан `.planning/prompt-for-next.md` — этот файл

## Следующие шаги: Этап 1 — Монорепозиторий + Vite
1. Создать структуру монорепозитория:
   - Перенести `frontend/` → `packages/frontend/`
   - Перенести `backend/` → `packages/backend/`
   - Создать `packages/shared/` (пока с базовым package.json)
   - Создать корневой `package.json` с `workspaces: ["packages/frontend", "packages/backend", "packages/shared"]`
   - Настроить корневые конфиги: `eslint.config.mjs`, `.prettierrc`, `.gitignore`
2. Замена Webpack → Vite во фронтенде:
   - Удалить webpack-зависимости и конфиги
   - Установить Vite + плагины
   - Настроить `vite.config.ts` с алиасами (по образцу samvaro-shop)
   - Перенести `public/index.html` → `index.html` (Vite требует в корне)
   - Обновить скрипты в `packages/frontend/package.json`
3. Адаптировать бэкенд под монорепозиторий (без смены фреймворка)
4. Валидация: фронтенд и бэкенд запускаются, ESLint 0 ошибок

## Коммит
`init: создан PLAN.md, README.md, обновлены .clinerules, .planning/prompt-for-next.md`

## Предупреждения/заметки
- **Важно:** при переносе `frontend/` → `packages/frontend/` и `backend/` → `packages/backend/` нужно обновить пути в `tsconfig.json` и других конфигах
- Webpack-конфиг (`webpack.config.ts`) ссылается на `config/build/` — нужно сначала изучить эту папку
- Vite требует `index.html` в корне проекта, а не в `public/`
- Алиасы из `tsconfig.json` (`@mui/styled-engine`) нужно будет перенести в `vite.config.ts`
- `.gitignore` нужно обновить — сейчас их два (фронтенд и бэкенд), нужно объединить в корневой
- MUI использует `@mui/styled-engine-sc` вместо стандартного — нужно проверить совместимость с Vite
- Бэкенд использует Koa, не меняем фреймворк на этом этапе
