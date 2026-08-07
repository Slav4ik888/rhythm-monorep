import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



/** Get bunchesUpdated */
export async function templatesGetBunchesUpdatedController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'templatesGetBunchesUpdated'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.templates.getBunchesUpdated(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
