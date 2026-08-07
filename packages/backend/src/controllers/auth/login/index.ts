import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function loginController(ctx: Context): Promise<any> {
  const
    email   = String(ctx.request.body.authByLogin?.email),
    logTemp = createLogTemp(ctx, 'authByLogin', email),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.auth.login(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
