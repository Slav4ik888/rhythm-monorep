import { Next } from 'koa';
import { Context } from '../../../app/types/global';
import { createLogTemp, loggerServer as logger } from '../../../libs/loggers';
import { logsViewModel } from '../../../models/loggers/handlers/view';
import { responseError } from '../../../views';

export async function logsViewController(ctx: Context, next: Next): Promise<any> {
  const logTemp = createLogTemp(ctx, 'logsView'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { name, pass } = ctx.params;
    const result = await logsViewModel({ name, pass });

    ctx.status = result.statusCode;
    ctx.type = 'html';
    ctx.body = result.html;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
