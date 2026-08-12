import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import { updateGroupViewItemsModel, UpdateViewItem } from '../../../../models/dashboard-view/handlers-view/update';
import { responseError } from '../../../../views';

export async function dashboardViewUpdateController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'dashboardViewUpdate'),
    error = responseError(ctx, logger, logTemp);

  try {
    const body = ctx.request.body as UpdateViewItem;
    const result = await updateGroupViewItemsModel({
      ...body,
      userId: ctx.state.user.id,
    });
    ctx.status = 200;
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
