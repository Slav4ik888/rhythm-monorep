import { Context } from '../../../app/types/global';
import { createLogTemp, loggerDocs as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function getPolicyController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'getPolicy'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.docs.getPolicy(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
