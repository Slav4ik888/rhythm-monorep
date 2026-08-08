# Контекст для следующей сессии

## Дата
08.08.2026

## Контекст: что сделано в этой сессии
**Полностью исправлены ошибки type-only экспортов/импортов для Vite/esbuild**

1. **Проблема:** `isolatedModules: true` → esbuild стирает TS-интерфейсы/типы. Barrel-файлы реэкспортируют типы через value-синтаксис → несуществующие экспорты в браузере.

2. **Решение:** Создан скрипт `.planning/scripts/fix-type-exports.js` с двумя проходами:
   - **Проход 1 (экспорты):** Разделяет `export { Value, Type }` → `export { Value }` + `export type { Type }`. Рекурсивно раскрывает цепочки `export *`. Учитывает уже исправленные `export type { }`.
   - **Проход 2 (импорты):** Заменяет `import { Type }` → `import type { Type }` для всех type-only сущностей.

3. **Результат:**
   - `npm run dev -w packages/frontend` — HTTP 200 ✅
   - `npm test -w packages/frontend` — 184/185 suites, 1332/1333 tests ✅
   - Скрипт сохранён: `node .planning/scripts/fix-type-exports.js`

## Следующие шаги: Этап 3 — Технологические улучшения

1. React 18 → React 19
2. React Router 6 → React Router 7
3. Redux Toolkit → Zustand
4. TanStack Query для серверного состояния
5. PWA (vite-plugin-pwa + workbox)
6. Koa → NestJS + Fastify
7. Docker Compose для Firebase эмуляторов
8. Husky + lint-staged
9. README.dev.md с глоссарием доменных терминов
10. Обновление MUI до актуальной версии

## Коммит
`fix: исправлены type-only экспорты/импорты для совместимости с Vite/esbuild`

## Предупреждения/заметки
- **Скрипт `.planning/scripts/fix-type-exports.js`** — запускать при добавлении новых barrel-файлов или типов.
- **`vite build` всё ещё падает** из-за циклических зависимостей чанков Rollup.
- **ESLint (~1405 ошибок)** — предсуществующие.
- **1 упавший тест** — `config.test.ts` (ASSEMBLY_DATE), предсуществующая.
- **ESLint-правило `@typescript-eslint/consistent-type-exports`** добавлено в `.eslintrc.js`.
