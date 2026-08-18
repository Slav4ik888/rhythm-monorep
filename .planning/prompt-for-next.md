# Контекст для следующей сессии

## Дата

17.08.2026 (сессия 56)

## Контекст: что сделано в этой сессии

### Этап 56 — Фикс деплоя: package-lock.json блокирует git pull

На деплое (`bash deploy.sh` на VPS) `git pull` падал с ошибкой:
`Your local changes to the following files would be overwritten by merge: package-lock.json`.

Причина: на сервере `npm install` (другая версия npm, чем локально node 26 / npm 11,
lockfileVersion 3) перезаписывал `package-lock.json`; изменённый tracked-файл блокировал merge.

Исправления:

1. `deploy.sh` `git_pull`: `git pull` → `git fetch origin` + `git reset --hard origin/main`
   (сервер — чистая выкладка кода; секреты в `/etc/rhythm/`, сборки gitignored).
2. `deploy.sh` `install_dependencies`: `npm install` → `npm ci` (строго по lock-файлу, не правит его).
3. `README.dev.md`: ручной сценарий деплоя обновлён.

`VERSION` НЕ поднимался — изменение инфраструктурное, клиентский код/сборка не затронуты.

## Следующие шаги

1. Запушить изменения на GitHub и на сервере разово снять блокировку:
   ```bash
   cd /var/www/vtempe/data/rhythm2
   git checkout -- package-lock.json
   git pull
   bash deploy.sh
   ```
2. Дальше деплой — просто `bash deploy.sh` (скрипт сам сбросит дерево и поставит зависимости через `npm ci`).
3. Вернуться к пунктам «Следующие шаги» сессии 55 (проверки перед публикацией в прод: Firebase rules,
   `LOGS_PASS`, Redis, секреты `/etc/rhythm/`).

## Коммит

`fix: деплой — git fetch + reset --hard вместо git pull, npm ci вместо npm install`

## Предупреждения/заметки

- На сервере НЕ использовать `npm install` (правит lock-файл при другой версии npm) — только `npm ci`;
  при реальном обновлении зависимостей править lock локально и коммитить его.
- `git reset --hard origin/main` в deploy.sh сбрасывает ЛЮБЫЕ локальные изменения tracked-файлов на сервере —
  осознанно: секреты/сборки вне git (см. README.dev.md, «Серверная инфраструктура (prod)»).
- Актуальные цифры тестов (без изменений после сессии 55): backend **181 suites / 1179 тестов**,
  frontend **460 suites / 3189 тестов**, e2e 22 теста. Источник цифр — `.clinerules/test-policy.md`.
- Frontend-тесты запускаются 5 конфигами (`test:unit` ловит ВСЕ `.spec/test.ts(x)`, затем
  `test:entities`/`test:features`/`test:shared`/`test:widgets` — только `**/<слой>/**/*.test.ts` без `.test.tsx`).
- Линтер требует одинарные кавычки в JSX-атрибутах (`jsx-quotes`); `strict` в tsconfig бэкенда НЕ включён.
