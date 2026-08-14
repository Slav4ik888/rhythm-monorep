// packages/backend/src/config/load-env.ts
// Подгружает .env только вне production (локальная разработка и тесты).
// В production переменные задаёт systemd через EnvironmentFile (см. rhythm-server.service),
// поэтому .env в production сознательно игнорируется.

import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}
