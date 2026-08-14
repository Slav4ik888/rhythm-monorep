import { EmailConfig } from './types';

// SMTP-доступы вынесены в переменные окружения
// (см. README — раздел «Переменные окружения»).
export const emailConfig: EmailConfig = {
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
};
