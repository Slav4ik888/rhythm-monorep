import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerSignup as logger } from '../../../../libs/loggers';
import { signupByEmailEndModel } from '../../../../models/auth/signup/handlers/by-email-end';
import { setCookie } from '../../../../libs/firebase';
import { responseError } from '../../../../views';

export async function signupByEmailEndController(ctx: Context): Promise<any> {
  const email = String(ctx?.request?.body?.signupDataEnd?.email),
    logTemp = createLogTemp(ctx, 'signupByEmailEnd', email),
    error = responseError(ctx, logger, logTemp);

  try {
    const result = await signupByEmailEndModel({ signupDataEnd: ctx.request.body.signupDataEnd });

    // Установить cookie через Koa
    await setCookie(ctx, result.userCredential, result.newUserData, 'signup');

    ctx.body = {
      newUserData: result.newUserData,
      newCompanyData: result.newCompanyData,
      message: result.message,
    };
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
