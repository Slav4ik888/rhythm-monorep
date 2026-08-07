import { db } from '../../../../libs/firebase';
import { DbRef } from '../../../helpers';
import { User } from '../..';


/** Find user by email */
export const serviceFindUserByEmail = async (email: string): Promise<User> => {
  const
    snap = await db
      .collectionGroup(DbRef.USERS)
      .where('email', '==', email)
      .limit(1)
      .get();
  
  return snap.docs?.[0]?.data() as User// docs?.[0];
}
