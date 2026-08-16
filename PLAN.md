# План развития проекта «Ритм»

> Пересоздан 15.08.2026 (сессия 32) после аудита покрытия тестами и технического долга.
> Детали аудита — в `.planning/codebase/TEST-AUDIT.md`.

## Резюме пройденного (этапы 0–21 — закрыты)

Реорганизация завершена:

- монорепо (`packages/frontend`, `packages/backend`, `packages/shared`);
- бэкенд NestJS + Fastify (10 контроллеров), фронт React 19 + Vite + MUI 9;
- Zustand + React Query, IndexedDB + BroadcastChannel-синхронизация;
- PWA (vite-plugin-pwa + workbox, полный офлайн-сценарий на production-сборке);
- E2E Playwright (guest/customer/admin) + PWA-офлайн-тесты.

Покрытие на момент аудита: backend 127 suites / 993 теста; frontend 377 suites / 2926 тестов; E2E 28 тестов.

---

## Новый план (что делать дальше)

### P0 — Unit-тесты бизнес-логики backend

**Этап 22. `models/*/services` — unit-тесты сервисов**

Сервисы сейчас покрыты только косвенно (integration-тесты контроллеров). Покрыть юнитами с моками Firestore/Redis/Email.

- [x] 22.1 Фикстуры/моки Firestore (общий `models/tests/mocks/firestore.ts`); Redis/Email — добавятся в этапе 25 по мере надобности
- [x] 22.2 `auth/signup/services` (create-new-company, create-new-user, complection-user) + `auth/login/services` (check-is-user-disabled)
- [x] 22.3 `user/services` (get, update, find-user-by-email, find-user-by-id, set-verification, check-user-verification)
- [x] 22.4 `company/services` (get, update, delete-sheet)
- [ ] 22.5 `dashboard-view/services` (get-bunches, get-view-items, get-all-views, create-group-items, update, delete-group)
- [ ] 22.6 `templates/services` (get-templates, get-bunches-updated, update, delete)
- [ ] 22.7 `partner/services` (increase-follower, increase-register-started, increase-register-ended)
- [ ] 22.8 `google/services` (get-data)

**Этап 23. guards / interceptors / decorators**

- [ ] 23.1 `FirebaseAuthGuard` — `extractSessionCookie` (парсинг `uid/session`) + `canActivate` (мок `admin.auth()`)
- [ ] 23.2 `CheckVersionInterceptor` — 409 при рассинхроне версии
- [ ] 23.3 `LoggingInterceptor` — фильтрация internalUsers + `getUserId`
- [ ] 23.4 `CurrentUser` decorator

### P1 — Безопасность: Rate limiting

**Этап 24. Rate limiting на auth-эндпоинтах** (заявлен в требованиях, не реализован)

- [ ] 24.1 Подключить `@nestjs/throttler` (или Fastify-эквивалент) + конфигурация
- [ ] 24.2 Применить на `/api/auth/login/byEmail`, `/api/auth/signup/*`, `/api/auth/login/resetEmailPassword`
- [ ] 24.3 Integration-тесты: превышение лимита → 429

### P2 — Инфраструктурные unit-тесты backend

**Этап 25. libs / views / config**

- [ ] 25.1 `libs/firebase` (create-session-fastify, set-cookie-fastify)
- [ ] 25.2 `libs/redis` (session get/set, signup get/set/update-answer-time)
- [ ] 25.3 `libs/emails` (send-mail, send-group-mail)
- [ ] 25.4 `views/errors` (get-error-message, err-code)
- [ ] 25.5 `config/load-env`

### P2 — Тесты frontend API/хуков

**Этап 26. `shared/api`**

- [ ] 26.1 `api.ts` — interceptors, обработка 409 (сброс SW + reload), повтор запросов
- [ ] 26.2 `hooks/` — use-auth-query, use-company-queries, use-dashboard-data-query, use-dashboard-view-queries
- [ ] 26.3 `features/*` (company, dashboard-templates, hints, user, docs, partner)

### P3 — Smoke-тесты frontend UI

**Этап 27. widgets / pages**

- [ ] 27.1 `widgets/` — auth, sidebar, navbar, footer, dashboard-view, dashboard-data, hints, message-bar, page-loader
- [ ] 27.2 `pages/` — dashboard, company, company-profile, user-profile, demo, root

### P4 — Чистка техдолга + документация

**Этап 28. Чистка и документация API**

- [ ] 28.1 Удалить мёртвый код: `loggerServer`, `get-session-data-fastify.ts`, вложенный `packages/frontend/package-lock.json`, `packages/backend/src/sh`
- [ ] 28.2 Вынести `internalUsers` из `LoggingInterceptor` в env/config
- [ ] 28.3 Заменить `any` на типы (`FastifyRequest`) в guard/interceptors
- [ ] 28.4 Swagger / OpenAPI для API-контрактов
- [ ] 28.5 Дробление крупных файлов (`entities/dashboard-view/model/store.ts` (465), `widgets/dashboard-view/body-content/index.tsx` (352))

### Отложено (блокировано окружением)

**Реальные сценарии входа/регистрации** против Firebase Auth/Firestore/Redis-эмуляторов + сиды.
Требует Docker (в окружении отсутствует). Вернуться после установки Docker.

---

## Правила ведения плана

1. В конце каждой сессии: отметить выполненное `[x]`, обновить `.planning/prompt-for-next.md` (контекст, следующие шаги, коммит), при изменении кода — поднять `VERSION` в двух файлах.
2. В начале каждой сессии: прочитать `.planning/prompt-for-next.md` и `PLAN.md`.
3. Задача считается завершённой, когда `npm run lint` (0 ошибок) и `npm run test -w packages/backend` + `npm run test -w packages/frontend` проходят без ошибок.
