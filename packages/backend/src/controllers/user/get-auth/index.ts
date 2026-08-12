import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import { getAuthModel } from '../../../models/user/handlers/get-auth';
import { responseError } from '../../../views';

export async function getAuthController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'getAuth'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { id, companyId } = ctx.state.user;

    const result = await getAuthModel({ userId: id, companyId });
    ctx.body = result;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
