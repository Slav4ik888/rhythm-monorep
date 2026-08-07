import { Context } from '../../../../../../../app/types/global';
import { redisUpdateSignupAnswerTime, ResRedisGetSignup } from '../../../../../../../libs/redis';
import { SIGNUP_CODE_ANSWER_DELAY, SIGNUP_CODE_EXPIRED } from '../../../../consts';
import { isCodeExpired } from '../../../../utils';



/** Проверка ответа на код */
export const checkCodeAnswer = async (
  ctx       : Context,
  data      : ResRedisGetSignup,
  emailCode : string
) => {
  const { signupData, code, codeTime, answerTime } = data;

  // Обновить время ответа
  redisUpdateSignupAnswerTime(signupData.email, signupData, code, codeTime);

  // Проверить частоту ответа
  if ((Date.now() - answerTime) < SIGNUP_CODE_ANSWER_DELAY) return ctx.throw(400, {
    emailCode: 'Слишком частая попытка ответа'
  });

  // Проверить expired
  if (isCodeExpired(codeTime, SIGNUP_CODE_EXPIRED)) return ctx.throw(400, {
    emailCode: 'Время действия кода истекло, запросите код ещё раз'
  })

  // Проверить корректность кода
  if (emailCode !== code) return ctx.throw(400, {
    emailCode: 'Не верный код'
  });
}
