import { UserCredential } from 'firebase/auth';
import { Context } from '../../../../app/types/global';
import { User } from '../../../../models/user';
import { checkCsrfToken } from '../check-csrf-token';
import { createSession } from '../create-session';



/** Create token & sessionCookie */
export async function setCookie(
  ctx            : Context,
  userCredential : UserCredential,
  user           : User,
  logTemp        : string
) {
  checkCsrfToken(ctx);

  const idToken = await userCredential.user.getIdToken(true);

  await createSession(ctx, idToken, user);
}
