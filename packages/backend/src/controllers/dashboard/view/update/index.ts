import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import models from '../../../../models';
import { responseError } from '../../../../views';



export async function dashboardViewUpdateController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'dashboardViewUpdate'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.dashboard.view.updateGroupItems(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
