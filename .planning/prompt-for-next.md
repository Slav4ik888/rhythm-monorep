# Контекст для следующей сессии

## Дата

15.08.2026 (сессия 29)

## Контекст: что сделано в этой сессии

### Этап 19: Расширение E2E-покрытия — auth, реферальная программа, PWA

Расширен набор Playwright-тестов в `e2e/guest/` тремя новыми спеками (подход прежний: бэкенд/Firebase
не нужны, `/api/*` мокаются через `page.route()`, поднимается только Vite dev-сервер).

- `e2e/guest/auth.spec.ts` (4 теста): вход (успех → редирект на `/`, тело `POST /api/auth/login/byEmail`;
  пустая форма → валидация без запроса), восстановление пароля (`resetEmailPassword` из модалки),
  полный сценарий регистрации (`byEmailStart` → форма кода → `byEmailEnd` → редирект).
- `e2e/guest/referral.spec.ts` (4 теста): партнёрские ссылки `?ref=` — `POST /api/increaseFollower` с
  `{ partnerId }`, невалидный код не отправляется, идемпотентность, передача `partnerId` в `byEmailStart`.
- `e2e/guest/pwa.spec.ts` (3 теста): `/manifest.webmanifest` (name/short_name/start_url/display/icons),
  `<link rel="manifest">`, регистрация Service Worker (`navigator.serviceWorker.getRegistrations()`).

Итого E2E: 22 теста (11 существующих + 11 новых).

### Вскрытые детали

- localStorage: ключи с префиксом `Rhythm-` (`PREFIX = 'Rhythm-'` в `shared/lib/local-storage/model/main.ts`),
  значение — JSON-строка. В E2E проверяем `localStorage.getItem('Rhythm-partnerId')` (не `partnerId`).
- Валидация signup требует `permissions === true` (чекбокс) и `partnerId` (допустимо пустой/из LS).

## Следующие шаги

1. **Реальные сценарии входа/регистрации** против поднятого стека: Firebase Auth/Firestore/Redis эмуляторы
   из `docker-compose.yml` + сиды. Сейчас auth-флоу покрыт моками `page.route()` (фронт делегирует
   аутентификацию бэкенду `/api/auth/*`). Полный сквозной сценарий — отдельная задача: поднять эмуляторы,
   засидить пользователя/компанию, прогонять реальные `signInWithEmailAndPassword`.
2. **Офлайн/PWA на production-сборке:** сейчас проверены манифест + регистрация SW (dev). Полный
   офлайн-сценарий (рендер дашборда из SW-кэша без сети) — на `npm run build -w packages/frontend`
   - `preview`, с `context.setOffline(true)`.

## Коммит

`test: E2E-покрытие auth, реферальной программы (?ref=) и PWA`

## Предупреждения/заметки

- **check-version:** `VERSION` сейчас `2.30.0` в ОБОИХ файлах (`packages/frontend/src/app/config/index.ts`,
  `packages/backend/src/app/config/index.ts`) — синхронно.
- **POST-эндпоинты, возвращающие данные, должны иметь `@HttpCode(200)`** (NestJS default для POST — 201).
- **`user/logout`** — `@HttpCode(302)` + `@Res()` + `reply.redirect('/')`, не убирать.
- **Роутинг:** путь из одного сегмента (`/non-existent-page`) трактуется как `:companyId` (страница
  чужой компании), НЕ как 404. Для 404 нужен многосегментный путь (`/unknown/deep/route`).
- **E2E-моки:** гостевым страницам не мешает 500 от `getAuth` (graceful); перед тестом auth-флоу мокаем
  `**/api/user/getAuth` → 500, чтобы страницы login/signup рендерились без редиректа.
- **Локаторы форм:** кнопки — `getByRole('button', { name: 'Войти' | 'Регистрация' | 'Подтвердить' })`
  (заголовки совпадают по тексту — различаем по role); поле кода подтверждения без label —
  `page.locator('input[name="emailCode"]')`.
- Долгоживущие сведения (guard-мок для контроллеров, `@nestjs/testing`, PWA/SW, E2E,
  BroadcastChannel-синхронизация) — в `.clinerules/test-policy.md` и `README.dev.md`, здесь не дублировать.
