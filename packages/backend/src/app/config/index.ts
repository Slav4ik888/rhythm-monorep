// packages/backend/src/app/config/index.ts

import { day } from '../../shared/utils/dates';

export const cfg = {
  VERSION: '2.25.0',
  COOKIE_NAME: 'rhythm',
  SESSION_EXP: day(1), // Срок действия сессии (это максимально доступный в Firebase)
  SITE_URL: process.env.SITE_URL || 'https://rhy.thm.su',
  SITE_TITLE_FULL: 'Информационная панель «Ритм»',
  INFO_EMAIL: 'info@thm.su',

  UPLOAD: {
    MAX_FILE_SIZE: 3 * 1024 * 1024, // 3Mb
    MAX_TOTAL_FILE_SIZE: 12 * 1024 * 1024, // 12Mb
  },
};
