// packages/backend/src/models/auth/signup/handlers/by-email-start/send-code/send-email-code-confirmation.ts
// Рефакторинг: убран ctx, принимает явные параметры

import { loggerMail as logger } from '../../../../../../libs/loggers';
import { sendMail } from '../../../../../../libs/emails';
import { cfg } from '../../../../../../app/config';

/**
 * Отправляем Code для подтверждения почты
 */
export async function sendEmailCodeConfirmation(
  email: string,
  code: string,
  partnerId: string,
  firstName?: string,
): Promise<any> {
  await sendMail({
    to: email,
    subject: `Подтвердите эл.почту для доступа в "${cfg.SITE_TITLE_FULL}"`,
    template: 'confirmation',
    locals: {
      code,
      name: firstName || '',
      platform_name: cfg.SITE_TITLE_FULL,
      url_site: cfg.SITE_URL,
    },
  });

  // Отправка уведомлений о попытке регистрации пользователя
  await sendMail({
    to: cfg.INFO_EMAIL,
    subject: partnerId ? `Начало регистрации по партнёрской ссылке: ${partnerId}` : `Попытка участника Ритма: ${email}`,

    template: partnerId ? 'info-partner-registration-started' : 'info-attempt-registration',

    locals: {
      platform_name: cfg.SITE_TITLE_FULL,
      url_site: cfg.SITE_URL,
      partnerId,
      email,
    },
  });

  logger.info(`signupSendEmailCode [${email}] successfully!`);
}
