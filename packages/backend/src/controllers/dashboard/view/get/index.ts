import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import { responseError } from '../../../../views';

/**
 * DEPRECATED
 *  Get dashboard`s ViewItem[] */
export async function dashboardViewGetController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'dashboardViewGet'),
    error = responseError(ctx, logger, logTemp);

  try {
    // await models.dashboard.view.get(ctx);
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
