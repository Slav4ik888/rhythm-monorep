import { SignupData } from '../../../../../models';
import { parse } from '../../../../../shared/utils/strings';
import { client } from '../../../init';



export interface ResRedisGetSignup {
  code        : string
  codeTime    : number // Время получения кода
  answerTime? : number // Время последнего ответа
  signupData  : SignupData
}

export interface RedisGetSignup {
  code        : string
  codeTime    : number // Время получения кода
  answerTime  : number // Время последнего ответа
  signupData  : string
}


/** Get code & signupData from Redis */
export const redisGetSignup = async (email: string): Promise<ResRedisGetSignup> => {
  const data = await client.hGetAll(email) as unknown as RedisGetSignup

  return {
    code       : data?.code,
    signupData : parse(data?.signupData || ''),
    codeTime   : data?.codeTime,
    answerTime : data?.answerTime,
  }
}
