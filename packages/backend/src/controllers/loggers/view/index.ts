import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function logsViewController(ctx: Context, next: Next): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'logsView'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.logs.view(ctx, next);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
