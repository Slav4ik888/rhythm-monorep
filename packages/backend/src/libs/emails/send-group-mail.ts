// packages/backend/src/libs/emails/send-group-mail.ts

import { loggerMail as logger } from '../loggers';
import { sendMail } from './send-mail';
import { SendEmailOptions } from './types';

/** Отправляет групповую рассылку по списку адресов */
export async function sendGroupMail(
  config: SendEmailOptions,
  mailList: string[],
  email: string, // Sender email
) {
  const { subject, locals, template } = config;
  // TODO: добавить инфо про Sender email

  try {
    await Promise.all(mailList.map((to) => sendMail({ to, subject, locals, template })));
    logger.info('[f]: sendGroupMail success');
  } catch (err) {
    logger.error(err);
  }
}
