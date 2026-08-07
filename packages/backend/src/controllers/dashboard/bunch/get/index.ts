import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import models from '../../../../models';
import { responseError } from '../../../../views';



/** Get dashboard`s Bunch[] */
export async function dashboardBunchGetController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'dashboardBunchGet'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.dashboard.bunch.get(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
