import juice from 'juice';
import { emailConfig } from './email-config';
import { join } from 'path';
import { renderFile } from 'pug';
import { createTransport } from 'nodemailer';
import { htmlToText } from 'nodemailer-html-to-text';
import SMTPTransport from 'nodemailer-smtp-transport';
import StubTransport from 'nodemailer-stub-transport';
import { SendEmailOptions } from './types';


const { user, pass } = emailConfig;

const transportEngine = process.env.NODE_ENV === 'test' ?
  StubTransport() :
  SMTPTransport({
    // host: 'smtp.yandex.ru',
    host   : 'smtp.gmail.com',
    port   : 465,
    secure : true,
    auth   : {
      user,
      pass
    },
  });

const transport = createTransport(transportEngine);

transport.use('compile', htmlToText());


/**
 * sendMail - функция, отправляющая письмо на указанный адрес
 * options - объект, содержащий опции для отправки писем:
 * options.template - имя файла, содержащего шаблон письма
 * options.locals - объект с переменными, которые будут переданы в шаблон
 * options.to - email, на который будет отправлено письмо
 * options.subject - тема письма
 * пример:
 *     await sendMail({
 *       template: 'confirmation',
 *       locals: {token: 'token'},
 *       to: 'user@mail.com',
 *       subject: 'Подтвердите почту',
 *     });
 */
export async function sendMail(options: SendEmailOptions) {
  const { template, locals, to, subject, attachments } = options;
  const html = renderFile(
      join(__dirname, './templates', template) + '.pug',
      locals || {}
  );

  const message = {
    html: juice(html),
    to: {
      name    : 'not named',
      address : to,
    },
    subject,
    attachments
  };

  return transport.sendMail(message);
};

const _transportEngine = transportEngine;
export { _transportEngine as transportEngine };
