import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function googleGetDataController(ctx: Context, next: Next): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'googleGetData'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.google.getData(ctx, next);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
