import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDashboardTemplates as logger } from '../../../libs/loggers';
import { getBunchesUpdatedModel } from '../../../models/templates/handlers/get-bunches-updated';
import { responseError } from '../../../views';

/** Get bunchesUpdated */
export async function templatesGetBunchesUpdatedController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'templatesGetBunchesUpdated'),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await getBunchesUpdatedModel();
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
