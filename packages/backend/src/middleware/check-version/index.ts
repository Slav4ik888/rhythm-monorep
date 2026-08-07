import { Next } from 'koa';
import { Context } from '../../app/types/global';
import { cfg } from '../../app/config';
import { createLogTemp, loggerApp as logger } from '../../libs/loggers';
// import { ERR_CODE, getErrorMessage, NotAutorized } from '../../views';


/** Проверяем версию на клиенте */
export async function cv(ctx: Context, next: Next) {
  const clientVersion = ctx.request.headers['x-client-version'];
  const serverVersion = cfg.VERSION;

  // For dev testing
  // throw new NotAutorized(getErrorMessage(ERR_CODE.CookieNotAuth))

  if (clientVersion !== serverVersion) {
    logger.error(createLogTemp(ctx, 'cv'));

    ctx.status = 409; // Conflict
    ctx.body = {
      error: 'Version mismatch',
      clientVersion,
      serverVersion,
      updateRequired: true
    };

    return
  }

  // Продолжаем обработку, если версии совпадают
  return next();
}
