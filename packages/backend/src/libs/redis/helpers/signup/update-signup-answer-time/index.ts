import { SignupData } from '../../../../../models';
import { client } from '../../../init';
import { RedisGetSignup } from '../get-signup';



/** Если прислали ответ, то время code не обновляем */
export const redisUpdateSignupAnswerTime = async (
  email      : string,
  signupData : SignupData, // Обн старыми данными
  code       : string, // Обн текущий код
  codeTime   : number,
): Promise<void> => {
  const data: RedisGetSignup = {
    code,
    signupData : JSON.stringify(signupData),
    codeTime,
    answerTime : Date.now(), // Время последнего ответа
  };

  await client.hSet(email, { ...data });
}
