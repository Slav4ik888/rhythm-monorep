import { cfg } from '../../../../app/config';
import { sendMail } from '../../../../libs/emails';

/**
 * Отправка уведомлений о новом пользователе прошедшем по ссылке.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает partnerId напрямую.
 */
export const sendNotifications = async (partnerId: string): Promise<void> => {
  await sendMail({
    to: cfg.INFO_EMAIL,
    subject: `Переход по партнёрской ссылке: ${partnerId}`,
    template: 'info-partner-link',
    locals: {
      platform_name: cfg.SITE_TITLE_FULL,
      url_site: cfg.SITE_URL,
      partnerId,
    },
  });
};
