import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function templatesDeleteController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'templatesDelete'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.templates.delete(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
