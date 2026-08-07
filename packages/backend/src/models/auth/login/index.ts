import { validateAuthByLogin } from './validators';
import { setCookie } from '../../../libs/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../libs/firebase';
import { checkIsUserDisabled } from './services';
import { Context } from '../../../app/types/global';
import { serviceFindUserByEmail } from '../../user';
import { AuthByLogin } from './types';
import { serviceGetCompany } from '../../company';



export async function loginModel(ctx: Context): Promise<any> {
  const data = ctx?.request?.body?.authByLogin || {} as AuthByLogin;
  const { email = '', password } = data;

  validateAuthByLogin(ctx, data);

  await checkIsUserDisabled(ctx, email);

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user           = await serviceFindUserByEmail(email);

  if (! user) {
    ctx.throw(400, { general: 'Неверная почта или пароль' });
  }

  const company        = await serviceGetCompany(user.companyId);

  await setCookie(ctx, userCredential, user, 'login');

  ctx.body = { user, company, message : 'Login is successfully!' }
}
