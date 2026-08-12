import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import { deleteViewItemModel, DeleteViews } from '../../../../models/dashboard-view/handlers-view/delete';
import { responseError } from '../../../../views';

export async function dashboardViewDeleteController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'dashboardViewDelete'),
    error = responseError(ctx, logger, logTemp);

  try {
    const body = ctx.request.body as DeleteViews;
    await deleteViewItemModel({
      ...body,
      userId: ctx.state.user.id,
    });
    ctx.status = 200;
    ctx.body = {};
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
