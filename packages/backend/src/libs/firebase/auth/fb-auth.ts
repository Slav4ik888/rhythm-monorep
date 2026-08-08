// packages/backend/src/libs/firebase/auth/fb-auth.ts

import { Next } from 'koa';
import { admin } from '../config/admin-sdk';
import { getErrorMessage, NotAutorized, ERR_CODE } from '../../../views';
import { createLogTemp, loggerAuth } from '../../loggers';
import models from '../../../models';
import { Context } from '../../../app/types/global';
import { getSessionData } from './get-session-data';
import { redisSetSession } from '../../redis';

export async function fbAuthCookie(ctx: Context, next: Next) {
  try {
    const { sessionCookie } = getSessionData(ctx);

    if (!sessionCookie) throw new NotAutorized(getErrorMessage(ERR_CODE.CookieNotAuth));

    const decodedIdToken = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    // eslint-disable-next-line camelcase
    const auth_time = decodedIdToken.auth_time * 1000;
    console.log('decodedIdToken: ', decodedIdToken.auth_time);
    // eslint-disable-next-line camelcase
    console.log('auth_time: ', new Date(auth_time));
    const exp = decodedIdToken.exp * 1000;
    console.log('exp: ', new Date(exp));

    const user = await models.user.serviceFindUserById(decodedIdToken?.uid);

    ctx.state.user = { ...user };
    loggerAuth.info(createLogTemp(ctx, 'FBAuth'));

    redisSetSession(user, sessionCookie);
    return next();
  } catch (err) {
    // 'auth/id-token-expired'
    loggerAuth.error(`[FBAuth] - oшибка в верификации sessionCookie: ${err}`);

    ctx.status = 401;
    ctx.body = { err };
  }
}
