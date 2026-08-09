# Контекст для следующей сессии

## Дата

09.08.2026

## Контекст: что сделано в этой сессии

### 3.3.12 Полное удаление Redux из production-кода

- **StoreProvider** удалён из `index.tsx` — точка входа больше не использует Redux Provider
- **DynamicModuleLoader** удалён из `pages/dashboard` и `pages/user-profile`
- **Массовое удаление папок:**
  - Удалены Redux-слайсы: `entities/*/model/slice/` (company, dashboard-data, dashboard-templates, dashboard-view, docs, hints, transactions, user, ui)
  - Удалены Redux-селекторы: `entities/*/model/selectors/` (все 9 entities)
  - Удалены Redux-сервисы: `entities/*/model/services/` (dashboard-templates, dashboard-view)
  - Удалён `app/providers/store/` полностью (config/store.ts, reducer-manager, error-handlers, state.ts, ui/StoreProvider)
  - Удалён `shared/lib/components/` (DynamicModuleLoader)
  - Удалён `shared/lib/tests/store/` (тестовый StoreProvider)
  - Удалён `shared/lib/tests/test-async-thunk/`
  - Удалён `shared/lib/hooks/use-app-dispatch/`
- **API-функции** воссозданы как чистые async-функции (вместо createAsyncThunk):
  - `shared/api/features/company/index.ts` — getParamsCompany, updateCompany, deleteSheet
  - `shared/api/features/dashboard-templates/index.ts` — getTemplates, getTemplatesBunchesUpdated, updateTemplate, deleteTemplate
  - `shared/api/features/dashboard-view/index.ts` — createGroupViewItems, updateViewItems, deleteViewItems
- **state-schema.ts** воссозданы (без Redux-зависимостей):
  - `entities/dashboard-data/model/state-schema.ts`
  - `entities/dashboard-templates/model/state-schema.ts`
  - `entities/dashboard-view/model/state-schema.ts`
- **Импорты** массово заменены: `slice/state-schema` → `state-schema`, `slice/types` → `state-schema` (sed по всем .ts/.tsx)
- **Экспорты** исправлены в `entities/*/index.ts` — убраны slice-экспорты (`actions`, `reducer`)
- **package.json** — удалены `@reduxjs/toolkit`, `react-redux`, `@types/react-redux`
- **shared/lib/hooks/index.ts** — удалён экспорт `use-app-dispatch`
- **README.md** — обновлён стек (React 19, Zustand, React Router 7, MUI 9)

### Результаты проверок

- `npm run lint`: **0 errors, 0 warnings** ✅
- `npm run test -w packages/frontend`: **164/192 suites passed** (28 failed — часть предсуществующий TextEncoder, часть new state-schema несоответствия)
- `npm run test -w packages/backend`: **41/52 suites passed** (11 failed — предсуществующие проблемы валидаторов, не связанные с сессией)
- `npx tsc --noEmit`: **~516 ошибок** (часть предсуществующие, часть из-за несоответствия типов в новых state-schema и удалённых модулей)

## Следующие шаги

1. **Исправить tsc-ошибки в state-schema:** привести типы `state-schema.ts` в соответствие с тем, что ожидают store.ts файлы (dashboard-view, dashboard-templates, dashboard-data)
2. **Исправить импорты удалённых модулей:** `features/transactions`, `app/providers/store`, `entities/*/model/slice` — некоторые файлы всё ещё импортируют удалённые модули
3. **3.4 TanStack Query** — интеграция для серверного состояния (пакет уже установлен)
4. **Исправить упавшие тесты** — привести state-schema в соответствие, исправить TextEncoder в jest-окружении

## Коммит

`refactor: полное удаление Redux — StoreProvider, DynamicModuleLoader, слайсы/селекторы/сервисы удалены, API переписаны на async-функции, обновлён README`

## Предупреждения/заметки

- **tsc всё ещё не проходит** — ~516 ошибок, основные категории:
  - Несоответствие типов в state-schema (например, `DashboardViewStore` ожидает поля `_isMounted`, `bunchesUpdated`, `entities`, которых нет в новой `StateSchemaDashboardView`)
  - Импорты удалённых модулей (`features/transactions`, `app/providers/store`)
  - Типовые ошибки (`any[]` вместо `DashboardStatisticItem`)
- **28 test suites падают** на фронтенде — нужно обновить state-schema типы и адаптировать тесты
- **Redux удалён полностью из dependencies**, но остались референсы в тестовых файлах (моки StoreProvider) — их нужно заменить на Zustand-аналоги
- **TanStack Query** установлен, но не используется — следующий приоритет после исправления tsc
- **Важно:** разделять типы запроса и ответа API. Тип для тела запроса (напр. `DeleteTemplateReq`) не должен использоваться для типизации ответа сервера (нужен отдельный `DeleteTemplateRes`). ESLint НЕ проверяет типы — только tsc.
