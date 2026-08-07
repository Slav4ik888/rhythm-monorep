import { getErrorMessage } from '../../../../views';
import { ERR_CODE } from '../../../../views/errors';
import { Context } from 'koa';
import { admin } from '../../../../libs/firebase';



/** Проверяем является ли пользователь удалённым (отключенным) */
export async function checkIsUserDisabled(ctx: Context, email: string | undefined): Promise<any> {
  if (! email) ctx.throw(400, { email: getErrorMessage(ERR_CODE.InvalidEmail) });

  const userRecord = await admin.auth().getUserByEmail(email);
  if (userRecord.disabled) ctx.throw(400, { email: getErrorMessage(ERR_CODE.AccountDisabled) });
}
