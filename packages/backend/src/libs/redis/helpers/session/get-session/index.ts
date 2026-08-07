import { User } from '../../../../../models/user';
import { parse } from '../../../../../shared/utils/strings';
import { client } from '../../../init';


export interface ResRedisGet {
  cookie : string
  user   : User | undefined
}

interface RedisGet {
  cookie : string
  user   : string // User in JSON
}

/** Get cookie & user from Redis */
export const redisGetSession = async (userId: string): Promise<ResRedisGet> => {
  const data = await client.hGetAll(userId) as unknown as RedisGet

  return {
    cookie: data?.cookie || '',
    user: parse(data?.user)
  }
}
