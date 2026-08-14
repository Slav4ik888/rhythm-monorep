// packages/backend/src/models/loggers/pass.ts
// Пароль для доступа к логам (эндпоинты /loggers/view, /loggers/download, /loggers/clear).
// Секрет вынесен в переменную окружения LOGS_PASS (см. README — раздел «Переменные окружения»),
// чтобы не хранить его в gitignored-файле src/logs/pass.ts.

export const PASS = process.env.LOGS_PASS || '';
