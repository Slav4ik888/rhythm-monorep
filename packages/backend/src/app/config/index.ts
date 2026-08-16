// packages/backend/src/app/config/index.ts

import { day } from '../../shared/utils/dates';

// Служебные пользователи, логи которых не пишутся в url.log (см. LoggingInterceptor).
// Переопределяется через env INTERNAL_USERS (ID через запятую).
const DEFAULT_INTERNAL_USERS = [
  'pT5sk0UDkzgVGXtCRLjk72h4jwV2',
  'wQ51kIvT2xPNVa2uuU0qhcjzqJB3',
  'xcUt9EYBrUbJd3JKiUf05Oxpp5f2',
  '4749Iuxb6ZbOfQsDuPp6ChSIvaI3',
];

export const cfg = {
  VERSION: '2.51.0',
  COOKIE_NAME: 'rhythm',
  SESSION_EXP: day(1), // Срок действия сессии (это максимально доступный в Firebase)
  SITE_URL: process.env.SITE_URL || 'https://rhy.thm.su',
  SITE_TITLE_FULL: 'Информационная панель «Ритм»',
  INFO_EMAIL: 'info@thm.su',

  INTERNAL_USERS: (process.env.INTERNAL_USERS || DEFAULT_INTERNAL_USERS.join(','))
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),

  UPLOAD: {
    MAX_FILE_SIZE: 3 * 1024 * 1024, // 3Mb
    MAX_TOTAL_FILE_SIZE: 12 * 1024 * 1024, // 12Mb
  },
};
