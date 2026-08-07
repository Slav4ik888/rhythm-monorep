import { Context } from '../../../../app/types/global';

export const getUserId = (ctx: Context): string => ctx.state.user.id;
