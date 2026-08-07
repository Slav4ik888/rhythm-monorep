import { Context } from '../../../../app/types/global';
import { createLogTemp, loggerSignup as logger } from '../../../../libs/loggers';
import models from '../../../../models';
import { responseError } from '../../../../views';



export async function signupSendCodeController(ctx: Context): Promise<any> {
  const
    email   = String((ctx?.request?.body?.signupData)?.email),
    logTemp = createLogTemp(ctx, 'signupSendCode', email),
    error   = responseError(ctx, logger, logTemp);

  try {
    await models.auth.signupSendCode(ctx);
    logger.info(`${logTemp} success`);
  }
  catch (err) {
    error(err);
  }
}
