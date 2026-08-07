import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



/** Add | Update templates */
export async function templatesUpdateController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'templatesUpdate'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.templates.update(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
