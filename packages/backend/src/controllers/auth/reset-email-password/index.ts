import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function resetEmailPasswordController(ctx: Context): Promise<any> {
  const
    email   = ctx.request.body.email,
    logTemp = createLogTemp(ctx, 'resetEmailPassword', email),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    await models.auth.resetEmailPassword(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
