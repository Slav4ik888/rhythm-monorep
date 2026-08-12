import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerSignup as logger } from '../../../../libs/loggers';
import { signupSendCodeModel } from '../../../../models/auth/signup/handlers/by-email-start/send-code';
import { responseError } from '../../../../views';

export async function signupSendCodeController(ctx: Context): Promise<any> {
  const email = String(ctx?.request?.body?.signupData?.email),
    logTemp = createLogTemp(ctx, 'signupSendCode', email),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await signupSendCodeModel({ signupData: ctx.request.body.signupData });
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
