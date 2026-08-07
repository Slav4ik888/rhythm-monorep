import { cfg } from '../../../../app/config';
import { admin } from '../../../../libs/firebase';
import { sendMail } from '../../../../libs/emails';



/** Create & send reset password link */
export const sendLink = async (email: string): Promise<boolean> => {
  const actionCodeSettings = {
    handleCodeInApp: true,
    url: cfg.SITE_URL,
  };

  const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

  if (link) await sendMail({
    to       : email,
    subject  : `'Ссылка для восстановления доступа на сайт - "${cfg.SITE_TITLE_FULL}"`,
    template : 'reset-email-password',
    locals   : {
      name          : '',
      platform_name : cfg.SITE_TITLE_FULL,
      url_site      : cfg.SITE_URL,
      url_link      : link
    }
  });

  return Boolean(link);
}
