import { Context } from 'koa';
import { ERR_CODE, getErrorMessage } from '../../../../views';
import { isNotFreeEmail } from '../is-not-free-email';


/** Проверяем свободен ли email и возвращаем ошибку если чо */
export const checkIsNotFreeEmail = async (ctx: Context, email: string): Promise<unknown> => {
  const isNotFree = await isNotFreeEmail(email);
  if (isNotFree) return ctx.throw(400, { email: getErrorMessage(ERR_CODE['auth/email-already-exists']) });
}
