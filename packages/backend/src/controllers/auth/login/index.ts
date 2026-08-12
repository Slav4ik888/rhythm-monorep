import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import { loginModel } from '../../../models/auth/login';
import { setCookie } from '../../../libs/firebase';
import { responseError } from '../../../views';

export async function loginController(ctx: Context): Promise<any> {
  const email = String(ctx.request.body.authByLogin?.email),
    logTemp = createLogTemp(ctx, 'authByLogin', email),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await loginModel({ authByLogin: ctx.request.body.authByLogin });

    // Установить cookie через Koa
    await setCookie(ctx, result.userCredential, result.user, 'login');

    ctx.body = { user: result.user, company: result.company, message: result.message };
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
