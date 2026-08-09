# Контекст для следующей сессии

## Дата

09.08.2026

## Контекст: что сделано в этой сессии

### 3.3.2 Миграция entities/docs на Zustand ✅

**Новые файлы:**

- `packages/frontend/src/entities/docs/model/store.ts` — Zustand-стор
- `packages/frontend/src/entities/docs/model/store.test.ts` — 10 тестов (10/10 passed)

**Изменённые файлы:**

- `packages/frontend/src/entities/docs/model/hooks/use-docs/index.ts` — Redux dispatch → Zustand actions + прямой API-вызов
- `packages/frontend/src/features/docs/get-policy/model/services/get-policy/index.ts` — `createAsyncThunk` → прямой API-вызов
- `packages/frontend/src/entities/docs/index.ts` — убран `reducerDocs`, добавлен `useDocsStore`
- `packages/frontend/src/app/providers/store/config/store.ts` — убран `import reducerDocs`, удалён ключ `docs`
- `packages/frontend/src/app/providers/store/config/state.ts` — `docs: StateSchemaDocs` → `docs?: StateSchemaDocs`
- `packages/frontend/src/pages/policy/ui/index.tsx` — убран DynamicModuleLoader + reducerDocs

### Результаты проверок

- `npm run lint`: **36 ошибок** (все предсуществующие)
- `npm run test -w packages/frontend`: **16 failed, 172 passed, 1298 tests** (+1 suite docs, +10 тестов, 0 новых фейлов)

### План миграции (прогресс)

| #   | Слайс               | Строк | Сложность     | Статус       |
| --- | ------------------- | ----- | ------------- | ------------ |
| 0   | UI                  | 123   | —             | ✅ Завершён  |
| 1   | Transactions        | 45    | Низкая        | ✅ Завершён  |
| 2   | Docs                | 49    | Низкая        | ✅ Завершён  |
| 3   | Hints               | 102   | Средняя       | ⏳ Следующий |
| 4   | User                | 77    | Средняя       | —            |
| 5   | Company             | 118   | Средняя       | —            |
| 6   | Dashboard-data      | 153   | Высокая       | —            |
| 7   | Dashboard-templates | 197   | Высокая       | —            |
| 8   | Dashboard-view      | 390   | Очень высокая | —            |

## Следующие шаги

1. **3.3.3 Hints** — unit-тесты на Redux-слайс → Zustand-стор с теми же тестами → замена в компонентах → удалить Redux
   - Файлы: `entities/hints/model/slice/slice.ts` (102 строки, asyncThunk: dontShowAgain)

## Коммит

`refactor: миграция entities/docs на Zustand, тесты (10/10 passed)`

## Предупреждения/заметки

- **UI, Transactions и Docs полностью на Zustand**
- **Шаблон Zustand-стора**: `entities/ui/model/store.ts` (сложный), `entities/transactions/model/store.ts` (простой), `entities/docs/model/store.ts` (средний)
- **Шаблон теста**: `entities/transactions/model/store.test.ts`, `entities/docs/model/store.test.ts`
- **Важно**: тестовые файлы называть `*.test.ts` (не `*.spec.ts`), иначе конфиг entities их не найдёт
- **Линтер:** 36 ошибок — предсуществующие
- **Тесты:** backend 13 фейлов, frontend 16 фейлов — предсуществующие
