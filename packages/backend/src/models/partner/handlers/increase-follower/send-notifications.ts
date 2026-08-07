import { IncreaseFollowerConfig } from '.';
import { cfg } from '../../../../app/config';
import { Context } from '../../../../app/types/global';
import { sendMail } from '../../../../libs/emails';



/**
 * Отправка уведомлений о новом пользователе прошедшем по ссылке
 */
export const sendNotifications = async (ctx: Context): Promise<void> => {
  const { partnerId } = ctx.request.body as IncreaseFollowerConfig;

  await sendMail({
    to       : cfg.INFO_EMAIL,
    subject  : `Переход по партнёрской ссылке: ${partnerId}`,
    template : 'info-partner-link',
    locals: {
      platform_name : cfg.SITE_TITLE_FULL,
      url_site      : cfg.SITE_URL,
      partnerId,
    },
  });
};
