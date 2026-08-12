import { Context } from '../../../app/types/global';
import { createLogTemp, loggerLogin as logger } from '../../../libs/loggers';
import { resetEmailPasswordModel } from '../../../models/auth/reset-email-password';
import { responseError } from '../../../views';

export async function resetEmailPasswordController(ctx: Context): Promise<any> {
  const { email } = ctx.request.body,
    logTemp = createLogTemp(ctx, 'resetEmailPassword', email),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await resetEmailPasswordModel({ email: email || '' });
    ctx.status = result.success ? 200 : 400;
    ctx.body = { message: result.message };
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
