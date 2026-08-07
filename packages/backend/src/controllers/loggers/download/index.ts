import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import models from '../../../models';
import { responseError } from '../../../views';



export async function logsDownloadController(ctx: Context, next: Next): Promise<any> {
  const
    logTemp = createLogTemp(ctx, 'logsDownload'),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.logs.download(ctx, next);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
