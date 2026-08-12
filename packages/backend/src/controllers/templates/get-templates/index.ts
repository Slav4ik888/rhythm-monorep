import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import { getTemplatesModel } from '../../../models/templates/handlers/get-templates';
import { responseError } from '../../../views';

/** Get templates`s Bunch[] */
export async function templatesGetTemplatesController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'templatesGetTemplates'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { bunchIds } = ctx.request.body as any;
    const result = await getTemplatesModel({ bunchIds });
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
