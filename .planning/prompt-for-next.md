# Контекст для следующей сессии

## Дата

09.08.2026

## Контекст: что сделано в этой сессии

### 3.3.4 Миграция entities/user на Zustand ✅

**Новые файлы:**

- `packages/frontend/src/entities/user/model/store.ts` — Zustand-стор
- `packages/frontend/src/entities/user/model/store.test.ts` — 15 тестов (15/15 passed)

**Изменённые файлы:**

- `packages/frontend/src/entities/user/model/hooks/use-user/index.ts` — Redux dispatch → Zustand actions + прямой вызов `getAuth`
- `packages/frontend/src/entities/user/model/services/get-auth/index.ts` — `createAsyncThunk` → прямая async-функция с `useUserStore.getState()`
- `packages/frontend/src/entities/user/index.ts` — добавлен экспорт `useUserStore`
- `packages/frontend/src/shared/api/features/user/logout/index.ts` — `dispatch(actionsUser.clearUser())` → `useUserStore.getState().clearUser()`
- `packages/frontend/src/shared/api/features/user/update-user/index.ts` — `dispatch(actionsUser.updateUser())` → `useUserStore.getState().updateUser()`
- `packages/frontend/src/app/providers/store/config/error-handlers.ts` — `dispatch(actionsUser.clearUser())` → `useUserStore.getState().clearUser()`
- `packages/frontend/src/pages/login/model/services/auth-by-email/index.ts` — `dispatch(actionsUser.setUser())` → `useUserStore.getState().setUser()`
- `packages/frontend/src/pages/signup/model/services/signup-by-email-end/index.ts` — `dispatch(actionsUser.setUser())` → `useUserStore.getState().setUser()`
- `packages/frontend/src/app/providers/store/config/store.ts` — убран `import reducerUser`, удалён ключ `user`
- `packages/frontend/src/shared/lib/tests/store/create-redux-store/index.ts` — убран `reducerUser`
- `packages/frontend/src/app/providers/store/config/state.ts` — `user: StateSchemaUser` → `user?: StateSchemaUser`

### Результаты проверок

- `npm run lint`: **36 ошибок** (все предсуществующие)
- `npm run test:entities -w packages/frontend` (entities/user): **store.test.ts 15/15 passed**, 1 предсуществующий фейл в validate-user-schema
- `npm run test -w packages/backend`: не запускался (нет изменений в бэкенде)

### План миграции (прогресс)

| #   | Слайс               | Строк | Сложность     | Статус       |
| --- | ------------------- | ----- | ------------- | ------------ |
| 0   | UI                  | 123   | —             | ✅ Завершён  |
| 1   | Transactions        | 45    | Низкая        | ✅ Завершён  |
| 2   | Docs                | 49    | Низкая        | ✅ Завершён  |
| 3   | Hints               | 102   | Средняя       | ✅ Завершён  |
| 4   | User                | 77    | Средняя       | ✅ Завершён  |
| 5   | Company             | 118   | Средняя       | ⏳ Следующий |
| 6   | Dashboard-data      | 153   | Высокая       | —            |
| 7   | Dashboard-templates | 197   | Высокая       | —            |
| 8   | Dashboard-view      | 390   | Очень высокая | —            |

## Следующие шаги

1. **3.3.5 Company** — unit-тесты на Redux-слайс → Zustand-стор с теми же тестами → замена в компонентах → удалить Redux
   - Файлы: `entities/company/model/slice/slice.ts` (118 строк, 3 asyncThunk: getCompany, setChangedCompany, deleteSheet)
   - **Критично**: company используется повсеместно (useCompany, reducerCompany в store, множество компонентов)
   - **Особенность**: в getAuth до сих пор используется `dispatch(actionsCompany.setCompany())` — company пока на Redux

## Коммит

`refactor: миграция entities/user на Zustand, тесты (15/15 passed)`

## Предупреждения/заметки

- **UI, Transactions, Docs, Hints и User полностью на Zustand**
- **Шаблон Zustand-стора**: `entities/ui/model/store.ts` (сложный), `entities/transactions/model/store.ts` (простой), `entities/docs/model/store.ts` (средний), `entities/hints/model/store.ts` (средний), `entities/user/model/store.ts` (средний)
- **Шаблон теста**: `entities/transactions/model/store.test.ts`, `entities/docs/model/store.test.ts`, `entities/hints/model/store.test.ts`, `entities/user/model/store.test.ts`
- **Важно**: тестовые файлы называть `*.test.ts` (не `*.spec.ts`)
- **Важно**: в Zustand сторе синхронные эквиваленты extraReducers: `startLoading()` (pending), `finishXxx()` (fulfilled), `failXxx()` (rejected)
- **Линтер:** 36 ошибок — предсуществующие
- **Тесты:** backend 11 фейлов, frontend entities 5 фейлов — предсуществующие
- **Осталось в Redux:** entities/company, dashboard-data, dashboard-templates, dashboard-view, страничные сторы (login, signup), features/user
