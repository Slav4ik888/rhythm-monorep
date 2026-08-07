import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function getAuthController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'getAuth'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.user.getAuth(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
