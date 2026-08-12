import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardView as logger } from '../../../libs/loggers';
import { deleteTemlateModel } from '../../../models/templates/handlers/delete';
import { responseError } from '../../../views';

export async function templatesDeleteController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'templatesDelete'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { templateId, bunchId, bunchUpdatedMs } = ctx.request.body as any;
    const result = await deleteTemlateModel({ templateId, bunchId, bunchUpdatedMs });

    ctx.status = 200;
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
