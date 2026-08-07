import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function logsClearController(ctx: Context, next: Next): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'logsClear'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.logs.clear(ctx, next);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
