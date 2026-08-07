import { cfg } from '../../../app/config';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import { responseError } from '../../../views';



/** Logout & clear cookie */
export async function logoutController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'logout'),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    logger.info(`${logTemp} вышел`);
    ctx.cookies.set(cfg.COOKIE_NAME, '');
    ctx.redirect('/');
  }
  catch (err) {
    error(err);
  }
}
