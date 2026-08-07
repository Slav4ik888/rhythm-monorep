import { Context } from 'koa';
import { cfg } from '../../../../app/config';
import { getCookies } from '../get-cookies';



export interface ResGetSessionData {
  userId        : string
  sessionCookie : string
}

/** Get cookie for this project */
export function getSessionData(ctx: Context): ResGetSessionData {

  const cookieData = getCookies(ctx)?.[cfg.COOKIE_NAME]?.split('/') || ['', ''];

  return {
    userId        : cookieData[0],
    sessionCookie : cookieData[1]
  };
}
