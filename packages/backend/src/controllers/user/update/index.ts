import { Context } from '../../../app/types/global';
import { createLogTemp, loggerUser as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function userUpdateController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'userUpdate'),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    await models.user.update(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
