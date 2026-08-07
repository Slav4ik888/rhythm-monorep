import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



/** Get templates`s Bunch[] */
export async function templatesGetTemplatesController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'templatesGetTemplates'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.templates.getTemplates(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
