# Контекст для следующей сессии

## Дата

11.09.2026 (сессия 59)

## Контекст: что сделано в этой сессии

### Этап 59 — Проверки перед публикацией в прод (Firebase rules, LOGS_PASS, Redis, секреты)

Закрыт пункт «Следующие шаги» сессий 55/56 (проверки продакшен-готовности):

1. Добавлен `firestore.rules` (закрыт: `allow read, write: if false`) — в репо был только `storage.rules`,
   и `firebase deploy --only firestore:rules` не имел файла правил. Подключён в `firebase.json` и
   смонтирован в `docker-compose.yml`.
2. Добавлен скрипт `check-prod-readiness.sh` (корень репо) — проверка секретов `/etc/rhythm/`, `LOGS_PASS`,
   Redis, systemd-юнита, Nginx + напоминание про Firebase rules. Запуск на сервере: `bash check-prod-readiness.sh`.
3. `README.dev.md`: раздел «Проверки перед публикацией в прод (checklist)» + упоминание `firestore.rules`.
4. `VERSION` → `2.58.0` в ДВУХ конфигах (клиентский код не менялся, бандл версии синхронизирован).

## Следующие шаги

1. На боевом сервере выполнить `bash check-prod-readiness.sh` и устранить все `[FAIL]`.
2. Применить боевые Firestore-правила: `firebase deploy --only firestore:rules,storage:rules`
   (нужна авторизация `firebase login` + project `rhythm-g2d7`) и убедиться в Firebase Console,
   что Firestore и Storage стоят в режиме «закрыто» (`allow read, write: if false`).

## Коммит

`infra: проверки продакшен-готовности — firestore.rules (закрыт), check-prod-readiness.sh, документация`

## Предупреждения/заметки

- Все обращения к Firestore идут через бэкенд (Admin SDK), который обходит Firestore-правила —
  закрытие правил (`allow read, write: if false`) не ломает эмуляторные тесты и прод.
- `firebase deploy --only firestore:rules,storage:rules` — отдельный ручной шаг (firebase CLI + auth),
  НЕ включён в `deploy.sh`.
- `check-prod-readiness.sh` — read-only, ничего не меняет; выходит с кодом 1 при критичных `[FAIL]`.
- `ASSEMBLY_DATE` (`2026-09-11`) — сегодняшняя дата; не менять без смены даты, иначе падает
  `config.test.ts` («ASSEMBLY_DATE — сегодняшняя дата»).
- `VERSION` должен быть синхронен в `packages/frontend/src/app/config/index.ts` и
  `packages/backend/src/app/config/index.ts` (CheckVersionInterceptor → 409 при рассинхроне).
- Frontend-тесты запускаются 5 конфигами (`test:unit` ловит ВСЕ `.spec/test.ts(x)`, затем
  `test:entities`/`test:features`/`test:shared`/`test:widgets`). Долгий прогон (~2-3 мин) — в фоне через nohup.
