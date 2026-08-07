import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import models from '../../../../models';
import { responseError } from '../../../../views';



export async function dashboardViewCreateGroupItemsController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'dashboardViewCreateGroupItems'),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    await models.dashboard.view.createGroupItems(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
