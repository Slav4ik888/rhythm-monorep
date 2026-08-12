import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDocs as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';

export async function getPolicyController(ctx: Context): Promise<void> {
  const logTemp = createLogTemp(ctx, 'getPolicy');
  const error = responseError(ctx, logger, logTemp);

  try {
    const result = await models.docs.getPolicy();
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
