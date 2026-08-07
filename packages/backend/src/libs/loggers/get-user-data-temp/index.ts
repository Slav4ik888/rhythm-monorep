import { Context } from '../../../app/types/global';


/**
 * Returns `[user]: ${userId}, [userEmail]: ${ctx.state.user?.email}`;
 *  or `[user]: quest`
 */
export const getUserDataTemp = (ctx: Context): string => {
  const userId = ctx?.state?.user?.id;

  return userId
    ? `[e]: ${ctx.state.user?.email} [u]: ${userId}`
    : `[u]: quest`;
}
