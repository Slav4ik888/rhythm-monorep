import { Context } from '../../../app/types/global';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function companyUpdateController(ctx: Context): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'companyUpdate'),
    error   = responseError(ctx, logger, logTemp);
  
  try {
    await models.company.update(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
