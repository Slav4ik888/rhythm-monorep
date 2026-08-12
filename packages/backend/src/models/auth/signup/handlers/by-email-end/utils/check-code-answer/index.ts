// packages/backend/src/models/auth/signup/handlers/by-email-end/utils/check-code-answer/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { redisUpdateSignupAnswerTime, ResRedisGetSignup } from '../../../../../../../libs/redis';
import { SIGNUP_CODE_ANSWER_DELAY, SIGNUP_CODE_EXPIRED } from '../../../../consts';
import { isCodeExpired } from '../../../../utils';

/** Проверка ответа на код */
export const checkCodeAnswer = async (data: ResRedisGetSignup, emailCode: string) => {
  const { signupData, code, codeTime, answerTime } = data;

  // Обновить время ответа
  redisUpdateSignupAnswerTime(signupData.email, signupData, code, codeTime);

  // Проверить частоту ответа
  if (Date.now() - answerTime < SIGNUP_CODE_ANSWER_DELAY) {
    throw Object.assign(new Error('Too frequent answer'), {
      statusCode: 400,
      body: { emailCode: 'Слишком частая попытка ответа' },
    });
  }

  // Проверить expired
  if (isCodeExpired(codeTime, SIGNUP_CODE_EXPIRED)) {
    throw Object.assign(new Error('Code expired'), {
      statusCode: 400,
      body: { emailCode: 'Время действия кода истекло, запросите код ещё раз' },
    });
  }

  // Проверить корректность кода
  if (emailCode !== code) {
    throw Object.assign(new Error('Invalid code'), {
      statusCode: 400,
      body: { emailCode: 'Не верный код' },
    });
  }
};
