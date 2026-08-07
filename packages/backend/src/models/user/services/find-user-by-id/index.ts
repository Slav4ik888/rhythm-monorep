import { db } from '../../../../libs/firebase';
import { User } from '../..';
import { DbRef } from '../../../helpers';



export async function serviceFindUserById(userId: string): Promise<User> {
  const snap = await db
    .collectionGroup(DbRef.USERS)
    .where('id', '==', userId)
    .limit(1)
    .get();

  return snap.docs?.[0]?.data() as User;
};
