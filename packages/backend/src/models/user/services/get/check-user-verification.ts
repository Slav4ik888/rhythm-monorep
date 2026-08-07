import { User } from '../..';
import { admin } from '../../../../libs/firebase';



/** Проверяем пройдена ли верификация email */
export async function serviceCheckUserVerification(user: User): Promise<boolean> {
  const userData = await admin.auth().getUser(user.id);

  return userData.emailVerified
};
