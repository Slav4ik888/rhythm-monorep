# Доступ к дашборду компании (`checkDashboardAccess` / `isOwner` / `canAccess`)

Подсистема проверки прав доступа к дашборду компании на фронтенде. Отвечает на вопрос:
«имеет ли пользователь право просматривать/редактировать дашборд (или конкретную вкладку) компании».

## Расположение

```
packages/frontend/src/entities/company/model/hooks/use-access/
├── use-access.ts                 # Хук useAccess() — публичный API подсистемы
├── consts/index.ts               # ACCESS_PRIORITY, ACCESS_TYPE, ACCESS_LABELS, ACCESS_LABEL_TYPE
├── types/
│   ├── base.ts                   # AccessLevel ('n' | 'v' | 'e')
│   ├── dashboard-access.ts       # CompanyDashboardAccess, CompanyDashboardMember, CompanyDashboardAccessScheme
│   ├── profile-access.ts         # CompanyProfileAccess, CompanyProfileMember
│   └── index.ts                  # реэкспорт типов
└── utils/
    ├── check-dashboard-access/   # главная функция (порядок проверок)
    ├── is-owner/                 # владелец ли пользователь
    ├── get-user-dashboard-access/# поиск участника по email
    └── can-access/               # сравнение уровней доступа

packages/frontend/src/entities/company/types/company.ts  # Company (owner, dashboardMembers, dashboardPublicAccess), ParamsCompany
packages/frontend/src/shared/helpers/objects/get-value-by-scheme/index.ts  # getValueByScheme — чтение поля по строковому пути
packages/frontend/src/entities/dashboard-view/consts/consts.ts             # NO_SHEET_ID = 'no_sheetId'
```

## Модель данных

### `AccessLevel` — уровень доступа (`types/base.ts`)

```ts
type AccessLevel = 'n' | 'v' | 'e';
```

| Значение | Смысл                     | Приоритет (`ACCESS_PRIORITY`) | Лейбл (`ACCESS_TYPE`) |
| -------- | ------------------------- | ----------------------------- | --------------------- |
| `'n'`    | нет доступа               | 0                             | «Закрыт»              |
| `'v'`    | просмотр (с авторизацией) | 10                            | «Просмотр»            |
| `'e'`    | редактирование            | 20                            | «Редактирование»      |

### Права участника (`types/dashboard-access.ts`)

```ts
interface CompanyDashboardAccess {
  f: AccessLevel;
} // full — ко всему в Дашборде
interface CompanyDashboardMember {
  e: string;
  a: CompanyDashboardAccess;
} // e = email, a = права
enum CompanyDashboardAccessScheme {
  AF = 'a.f',
} // путь: member.a.f
```

Есть и профильные типы-«близнецы» (`types/profile-access.ts`): `CompanyProfileAccess` /
`CompanyProfileMember` — для доступа к профилю компании (в дашборд-проверке не участвуют,
но `Company.companyMembers` — это `CompanyProfileMember[]`).

### Поля `Company` / `ParamsCompany`, участвующие в проверке

| Поле                    | Тип                        | Роль в проверке                                                                        |
| ----------------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| `owner`                 | `Email`                    | владелец компании — получает доступ ко всему (`isOwner`)                               |
| `dashboardMembers`      | `CompanyDashboardMember[]` | права отдельных участников по email                                                    |
| `dashboardPublicAccess` | `Record<string, boolean>`  | публичный доступ по `dashboardPageId` (ключ `'main'`/`NO_SHEET_ID` — корневая вкладка) |

## Константы (`consts/index.ts`)

- **`ACCESS_PRIORITY: Record<AccessLevel, number>`** — `{ n: 0, v: 10, e: 20 }`. Используется в
  `canAccess` (сравнение уровней) и в `checkDashboardAccess` (публичная страница даёт доступ только
  если `requiredAccess < 'e'`, т.е. не редактирование).
- **`ACCESS_TYPE`** — `{ n: { label: 'Закрыт' }, v: { label: 'Просмотр' }, e: { label: 'Редактирование' } }`.
- **`ACCESS_LABELS`** — `['Закрыт', 'Просмотр', 'Редактирование']`.
- **`ACCESS_LABEL_TYPE`** — обратный маппинг лейбл → `AccessLevel`.

## Публичный API — хук `useAccess()`

Возвращает три флага (все — через `checkDashboardAccess` с scheme `AF = 'a.f'`):

| Флаг                            | `requiredAccess` | `dashboardPageId`          | Используется                                    |
| ------------------------------- | ---------------- | -------------------------- | ----------------------------------------------- |
| `isDashboardAccessView`         | `'v'`            | текущий `dashboardSheetId` | показывать/блокировать дашборд, сайдбар, navbar |
| `isDashboardAccessEdit`         | `'e'`            | текущий `dashboardSheetId` | режим редактирования                            |
| `isDashboardAccessViewById(id)` | `'v'`            | переданный `id` вкладки    | сайдбар — скрыть вкладки без доступа            |

Источники данных хука: `paramsCompany` из `useCompany()`, `email` из `useUser()`,
`dashboardSheetId` из `usePages()`.

## Алгоритм `checkDashboardAccess`

Порядок проверок (важен — ранний выход):

```
checkDashboardAccess(company, userEmail, scheme, requiredAccess, dashboardPageId = NO_SHEET_ID)
```

1. **`isOwner(company, userEmail)`** → `true`. Владелец проходит всегда, до любых других проверок.
2. **Публичная страница:** если `company.dashboardPublicAccess?.[dashboardPageId]` истинно **и**
   `ACCESS_PRIORITY[requiredAccess] < ACCESS_PRIORITY.e` (т.е. `requiredAccess !== 'e'`) → `true`.
   То есть публичный доступ даёт только просмотр, не редактирование.
3. **Неавторизован:** `if (!userEmail) return false`.
4. **`getUserDashboardAccess(company, userEmail)`** — ищет в `dashboardMembers` участника с `member.e === userEmail`.
5. **`getValueByScheme(allUserAccess, scheme)`** — достаёт уровень по строковому пути (для `'a.f'` → `member.a.f`).
6. **`canAccess(userAccess, requiredAccess)`** — `ACCESS_PRIORITY[userAccess] >= ACCESS_PRIORITY[requiredAccess]`.

## Хелперы

- **`isOwner(company, userEmail)`** — `company?.owner === userEmail`. Сравнение **регистрозависимое**
  (см. тест `is-owner.test.ts`).
- **`getUserDashboardAccess(company, userEmail)`** — `company.dashboardMembers.find(m => m.e === userEmail)`;
  возвращает `undefined`, если `company`/`dashboardMembers` отсутствуют или email не найден (тоже регистрозависимо).
- **`canAccess(userAccess, requiredAccess)`** — `false` при `!userAccess`; иначе сравнивает приоритеты.
- **`getValueByScheme(obj, scheme)`** — чтение вложенного поля по строке-пути через `.` (и индексы массивов
  `[N]`). Для scheme `'a.f'` извлекает `obj.a.f`.

## Потребители `useAccess`

- `pages/company/ui/index.tsx` — оборачивает дашборд (`:companyId` → `Outlet`): если
  `!isDashboardAccessView` → `null` + warning «У вас нет доступа к этой странице.». Если
  `!auth && !dashboardPublicAccess` — «…Возможно, необходимо авторизоваться».
- `pages/dashboard/ui/container.tsx` — гейтит загрузку данных (`getData`, `getBunches`) и кэша.
- `widgets/dashboard-view/body-content/index.tsx`, `widgets/navbar/index.tsx`,
  `shared/ui/wrappers/sidebar-regulator-wrapper/index.tsx` — отрисовка в зависимости от доступа.
- `widgets/sidebar/ui/render-routes/index.tsx` — скрывает вкладки через `isDashboardAccessViewById`.

## Практические нюансы

- **Владелец проходит всегда**, независимо от `dashboardMembers`/`dashboardPublicAccess`.
- **Публичный доступ** (`dashboardPublicAccess`) работает только для просмотра (`requiredAccess !== 'e'`),
  и только для конкретной `dashboardPageId` (ключ `NO_SHEET_ID`/`'main'` — корневая вкладка).
- **Email-сравнение регистрозависимое** и в `isOwner`, и в `getUserDashboardAccess`.
- **E2E-тесты:** чтобы защищённая страница/дашборд отрисовались без «У вас нет доступа», мокай
  владельца (`mockAuth` с `company.owner === user.email`, как в `e2e/admin/dashboard.spec.ts`).
  Дефолтный `createE2eUser()` (`Employee`) с пустым `dashboardMembers` даёт `isDashboardAccessView: false`.

## Тесты

| Файл                                                                      | Покрытие                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------- |
| `utils/can-access/tests/can-access.test.ts`                               | exact/higher/lower/undefined уровни                     |
| `utils/is-owner/tests/is-owner.test.ts`                                   | owner/не owner/undefined/case-sensitive                 |
| `utils/get-user-dashboard-access/tests/get-user-dashboard-access.test.ts` | поиск по email, дубли, undefined                        |
| `utils/check-dashboard-access/tests/check-dashboard-access.test.ts`       | владелец, публичные страницы, уровни, схемы, edge cases |

Запуск: `npm run test -w packages/frontend` (unit-конфиг подхватывает `entities/company`).
