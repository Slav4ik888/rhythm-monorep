import { User } from '../../../../../models/user';
import { client } from '../../../init';



/** Set cookie & user to Redis */
export const redisSetSession = async (
  user          : User,
  sessionCookie : string
): Promise<void> => {

  await client.hSet(user.id, {
    cookie : sessionCookie,
    user   : JSON.stringify(user)
  });
}
