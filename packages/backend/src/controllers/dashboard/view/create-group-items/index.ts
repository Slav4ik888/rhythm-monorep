import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../../libs/loggers';
import {
  createGroupViewItemsModel,
  CreateGroupViewItems,
} from '../../../../models/dashboard-view/handlers-view/create-group-items';
import { responseError } from '../../../../views';

export async function dashboardViewCreateGroupItemsController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'dashboardViewCreateGroupItems'),
    error = responseError(ctx, logger, logTemp);

  try {
    const body = ctx.request.body as CreateGroupViewItems;
    const result = await createGroupViewItemsModel({
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
