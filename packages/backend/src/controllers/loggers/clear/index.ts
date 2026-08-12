import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import { logsClearModel } from '../../../models/loggers/handlers/clear';
import { responseError } from '../../../views';

export async function logsClearController(ctx: Context, next: Next): Promise<any> {
  const logTemp = createLogTemp(ctx, 'logsClear'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { name, pass } = ctx.params;
    const result = await logsClearModel({ name, pass });

    ctx.status = result.statusCode;
    ctx.body = result.body;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
