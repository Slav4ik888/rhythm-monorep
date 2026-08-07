import { Next } from 'koa';
import { Context } from '../../app/types/global';
import { loggerUrl } from '../../libs/loggers';
import { getSessionData } from '../../libs/firebase';


/** Логируем базовые данные запроса */
export async function logging(ctx: Context, next: Next) {
  // Лог загрузки страницы
  // if ([
  //   '/api/user/getAuth',
  //   '/api/paramsCompany/get'
  // ].includes(ctx.path)) {

  // Лог загрузки любой страницы, чтобы понимать где люди шарахаются
  const { userId } = getSessionData(ctx);

  if (! [
    'pT5sk0UDkzgVGXtCRLjk72h4jwV2', // korzan-va-mail
    'wQ51kIvT2xPNVa2uuU0qhcjzqJB3', // info-thm
    'xcUt9EYBrUbJd3JKiUf05Oxpp5f2', // v-korzan-da-tele
    '4749Iuxb6ZbOfQsDuPp6ChSIvaI3', // Родя
  ].includes(userId)) {
    const user = userId ? userId : 'quest';

    const { companyId } = ctx.request.body;
    const ci = companyId ? `[ci]: ${companyId}` : '';

    loggerUrl.info(`[r]: ${ctx.request.url} ${ci} [u]: ${user} [ref]: ${ctx.get('Referer')}`);
  }
  
  return next();
}
