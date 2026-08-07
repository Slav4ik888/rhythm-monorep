import { cfg } from '../../../../app/config';
import { Context } from '../../../../app/types/global';
import { User } from '../../../../models/user';
import { redisSetSession } from '../../../redis';
import { admin } from '../../config/admin-sdk';



interface SessionOptions {
  maxAge   : number
  httpOnly : boolean
  path     : string
};
  

export async function createSession(
  ctx     : Context,
  idToken : string,
  user    : User
): Promise<void> {
  // Set session expiration to 30 days.
  const expiresIn = cfg.SESSION_EXP;

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

  // Set cookie policy for session cookie.
  // ADD secure: true, когда будет https
  const sessionOptions: SessionOptions = {
    maxAge   : expiresIn,
    httpOnly : true,
    path     : '/'
  };

  // Set to Redis
  redisSetSession(user, sessionCookie);

  // Add UserId
  const cookie = user.id + '/' + sessionCookie;
  
  ctx.cookies.set(cfg.COOKIE_NAME, cookie, sessionOptions);
}
