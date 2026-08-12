import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import { getBunchesModel, ReqGetBunches } from '../../../../models/dashboard-view/handlers-bunch/get';
import { responseError } from '../../../../views';

/** Get dashboard`s Bunch[] */
export async function dashboardBunchGetController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'dashboardBunchGet'),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await getBunchesModel(ctx.request.body as ReqGetBunches);
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
