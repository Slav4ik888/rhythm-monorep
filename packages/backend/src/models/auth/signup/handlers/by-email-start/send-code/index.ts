import { validateSignupData } from '../../../validators';
import { Context } from '../../../../../../app/types/global';
import { sendEmailCodeConfirmation } from './send-email-code-confirmation';
import { redisGetSignup, redisSetSignup } from '../../../../../../libs/redis';
import { generateCheckCode } from './utils/generate-check-code';
import { SignupData } from '../../../types';
import { SIGNUP_CODE_DELAY, SIGNUP_CODE_EXPIRED } from '../../../consts';
import { isCodeExpired } from '../../../utils/is-code-expired';



export async function signupSendCodeModel(ctx: Context): Promise<any> {
  const { signupData } = ctx.request.body as { signupData: SignupData };
  const { email, partnerId } = signupData;

  validateSignupData(ctx, signupData);

  const { code, codeTime } = await redisGetSignup(email);

  // Проверка на наличие и на частоту запроса кода
  if (code // Код уже есть
    && ! isCodeExpired(codeTime, SIGNUP_CODE_EXPIRED) // Код не просрочен
    && (Date.now() - codeTime) < SIGNUP_CODE_DELAY    // Время на частоту запросов не вышло
  ) {
    ctx.throw(400, {
      general: `Вы уже запросили код. Попробуйте через несколько минут`
    });
  }

  const newCode = generateCheckCode(); // Сделать код

  await redisSetSignup(email, signupData, newCode); // Сохранить данные (код и signupData) в Redis
  await sendEmailCodeConfirmation(ctx, newCode, partnerId);

  ctx.body = {
    message: `На указанную почту [${email}] отправлен код подтверждения`
  };
}
