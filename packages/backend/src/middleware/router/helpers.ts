import { Next } from 'koa';
import { Context } from '../../app/types/global';

/** emptyMiddleware */
export const em = (ctx: Context, next: Next) => next();
