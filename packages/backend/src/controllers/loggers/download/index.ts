import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import { logsDownloadModel } from '../../../models/loggers/handlers/download';
import { responseError } from '../../../views';

export async function logsDownloadController(ctx: Context, next: Next): Promise<any> {
  const logTemp = createLogTemp(ctx, 'logsDownload'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { name, pass } = ctx.params;
    const result = await logsDownloadModel({ name, pass });

    ctx.status = result.statusCode;

    if (result.contentType) {
      ctx.set('Content-Type', result.contentType);
    }
    if (result.contentDisposition) {
      ctx.set('Content-Disposition', result.contentDisposition);
    }

    ctx.body = result.body;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
