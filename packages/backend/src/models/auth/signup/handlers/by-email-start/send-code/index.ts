// packages/backend/src/models/auth/signup/handlers/by-email-start/send-code/index.ts
// Рефакторинг: убран ctx, принимает SignupData, возвращает результат

import { validateSignupData } from '../../../validators';
import { sendEmailCodeConfirmation } from './send-email-code-confirmation';
import { redisGetSignup, redisSetSignup } from '../../../../../../libs/redis';
import { generateCheckCode } from './utils/generate-check-code';
import { SignupData } from '../../../types';
import { SIGNUP_CODE_DELAY, SIGNUP_CODE_EXPIRED } from '../../../consts';
import { isCodeExpired } from '../../../utils/is-code-expired';

export interface SignupSendCodeArgs {
  signupData: SignupData;
}

export interface SignupSendCodeResult {
  message: string;
}

export async function signupSendCodeModel({ signupData }: SignupSendCodeArgs): Promise<SignupSendCodeResult> {
  const { email, partnerId, firstName } = signupData;

  validateSignupData(signupData);

  const { code, codeTime } = await redisGetSignup(email);

  // Проверка на наличие и на частоту запроса кода
  if (
    code && // Код уже есть
    !isCodeExpired(codeTime, SIGNUP_CODE_EXPIRED) && // Код не просрочен
    Date.now() - codeTime < SIGNUP_CODE_DELAY // Время на частоту запросов не вышло
  ) {
    throw Object.assign(new Error('Code already requested'), {
      statusCode: 400,
      body: {
        general: 'Вы уже запросили код. Попробуйте через несколько минут',
      },
    });
  }

  const newCode = generateCheckCode(); // Сделать код

  await redisSetSignup(email, signupData, newCode); // Сохранить данные (код и signupData) в Redis
  await sendEmailCodeConfirmation(email, newCode, partnerId, firstName);

  return {
    message: `На указанную почту [${email}] отправлен код подтверждения`,
  };
}
