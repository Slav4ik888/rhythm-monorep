import { Context } from '../../../../app/types/global';
import { ERR_CODE, getErrorMessage } from '../../../../views';
import { serviceFindUserByEmail } from '../../../user';



/** Проверяем есть ли такой пользователь в базе, если нет, то выпадет ошибка */
export const checkUser = async (ctx: Context, email: string | undefined) => {
  if (! email) ctx.throw(400, { email: getErrorMessage(ERR_CODE.InvalidEmail) });

  const user = await serviceFindUserByEmail(email);
  if (! user) ctx.throw(400, { email: getErrorMessage(ERR_CODE['auth/user-not-found']), label: email });
};
