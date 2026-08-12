import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import { updateTemplateModel } from '../../../models/templates/handlers/update';
import { getUserId } from '../../../models/user';
import { responseError } from '../../../views';

/** Add | Update templates */
export async function templatesUpdateController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'templatesUpdate'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { template, bunchUpdatedMs, bunchAction, fullSet } = ctx.request.body as any;
    const userId = getUserId(ctx);

    const result = await updateTemplateModel({
      template,
      bunchUpdatedMs,
      bunchAction,
      fullSet,
      userId,
    });

    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
