import { Context } from '../../../app/types/global';
import { createLogTemp, loggerPartner as logger } from '../../../libs/loggers';
import { increaseFollowerModel } from '../../../models/partner/handlers/increase-follower';
import { responseError } from '../../../views';

export async function increaseFollowerController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'partner/increaseFollower'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { partnerId } = ctx.request.body as any;
    await increaseFollowerModel({ partnerId });
    ctx.status = 200;
    ctx.body = { status: 'ok' };
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
