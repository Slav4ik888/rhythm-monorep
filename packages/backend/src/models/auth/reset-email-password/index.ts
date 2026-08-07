import { Context } from '../../../app/types/global';
import { validateResetEmailPassword } from './validators';
import { checkUser } from './check-user';
import { sendLink } from './send-link';



export async function resetEmailPasswordModel(ctx: Context): Promise<any> {
  const email = ctx.request?.body?.email || '';

  validateResetEmailPassword(ctx, email);
  await checkUser(ctx, email);

  const result = await sendLink(email);

  ctx.status = result ? 200 : 400;
  ctx.body = {
    message: result
      ? `Ссылка для восстановления пароля отправлена на почту: ${email}`
      : `Произошла ошибка, не получилось отправить ссылку, на указанную почту: ${email}`
  }
}
