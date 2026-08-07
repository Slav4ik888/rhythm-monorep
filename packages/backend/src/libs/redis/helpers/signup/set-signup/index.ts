import { SignupData } from '../../../../../models';
import { client } from '../../../init';
import { RedisGetSignup } from '../get-signup';



/** Set code & SignupData to Redis */
export const redisSetSignup = async (
  email      : string,
  signupData : SignupData,
  code       : string,
): Promise<void> => {
  const data: RedisGetSignup = {
    code,
    signupData : JSON.stringify(signupData),
    codeTime   : Date.now(), // Время получения кода
    answerTime : Date.now(),
  };

  await client.hSet(email, { ...data });
}
