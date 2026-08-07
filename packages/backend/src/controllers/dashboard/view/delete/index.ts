import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import models from '../../../../models';
import { responseError } from '../../../../views';



export async function dashboardViewDeleteController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'dashboardViewDelete'),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    await models.dashboard.view.delete(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
