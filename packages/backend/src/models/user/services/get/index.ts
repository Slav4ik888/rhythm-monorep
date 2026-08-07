import { User } from '../..';
import { DbRef, getRefDoc } from '../../../helpers';
import { serviceCheckUserVerification } from './check-user-verification';
import { serviceSetVerification } from './set-verification';


export async function serviceGetUser(companyId: string, userId: string): Promise<User> {
  const docUser = await getRefDoc(DbRef.USER, { companyId, userId }).get();

  if (! docUser.exists) return undefined;
  const user = docUser.data() as User;

  if (user.emailVerified) return user

  const isVerified = await serviceCheckUserVerification(user)

  if (isVerified) await serviceSetVerification(user);

  return user;
};
