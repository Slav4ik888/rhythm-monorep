// packages/backend/src/models/auth/signup/handlers/by-email-end/send-notifications/index.ts
// Рефакторинг: убран ctx (лого-темп формируется из email вместо ctx)

import { cfg } from '../../../../../../app/config';
import { sendMail } from '../../../../../../libs/emails';
import { loggerMail as logger } from '../../../../../../libs/loggers';
import { User } from '../../../../../user';

/**
 * Отправка уведомлений об успешной регистрации пользователя
 */
export const sendNotifications = async (user: User, name: string = ''): Promise<void> => {
  const { email, companyId, id: userId, partner } = user;
  const partnerId = partner.referrerId;

  await sendMail({
    to: cfg.INFO_EMAIL,
    subject: `Новый участник Ритма${partnerId ? ' (по партнёрской ссылке)' : ''}: ${email}`,
    template: partnerId ? 'info-partner-registration-ended' : 'info-registration',
    locals: {
      platform_name: cfg.SITE_TITLE_FULL,
      url_site: cfg.SITE_URL,
      partnerId,
      companyId,
      userId,
      name,
      email,
    },
  });

  logger.info(`signup info-registration [${email}] successfully!`);
};
