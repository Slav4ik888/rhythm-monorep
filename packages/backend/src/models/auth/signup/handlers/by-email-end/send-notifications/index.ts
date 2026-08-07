import { cfg } from '../../../../../../app/config';
import { sendMail } from '../../../../../../libs/emails';
import { createLogTemp, loggerMail as logger } from '../../../../../../libs/loggers';
import { Context } from '../../../../../../app/types/global';
import { User } from '../../../../../user';



/**
 * Отправка уведомлений об успешной регистрации пользователя
 */
export const sendNotifications = async (
  ctx  : Context,
  user : User,
  name : string = ''
): Promise<void> => {
  const { email, companyId, id: userId, partner } = user;
  const partnerId = partner.referrerId;
  const logTemp   = createLogTemp(ctx, 'signup info-registration', email);

  await sendMail({
    to       : cfg.INFO_EMAIL,
    subject  : `Новый участник Ритма${partnerId ? ' (по партнёрской ссылке)' : ''}: ${email}`,
    template : partnerId ? 'info-partner-registration-ended' : 'info-registration',
    locals: {
      platform_name : cfg.SITE_TITLE_FULL,
      url_site      : cfg.SITE_URL,
      partnerId,
      companyId,
      userId,
      name,
      email
    },
  });

  logger.info(`${logTemp} successfully!`);
};
