// packages/backend/src/models/auth/login/index.ts
// Рефакторинг: убран ctx, принимает LoginArgs, возвращает LoginResult

import { validateAuthByLogin } from './validators';
import { auth } from '../../../libs/firebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { checkIsUserDisabled } from './services';
import { serviceFindUserByEmail, User } from '../../user';
import { AuthByLogin } from './types';
import { Company, serviceGetCompany } from '../../company';

export interface LoginArgs {
  authByLogin: AuthByLogin;
}

export interface LoginResult {
  user: User;
  company: Company;
  userCredential: UserCredential;
  message: string;
}

export async function loginModel({ authByLogin }: LoginArgs): Promise<LoginResult> {
  const data = authByLogin || ({} as AuthByLogin);
  const { email = '', password } = data;

  validateAuthByLogin(data);

  await checkIsUserDisabled(email);

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = await serviceFindUserByEmail(email);

  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), {
      statusCode: 400,
      body: { general: 'Неверная почта или пароль' },
    });
  }

  const company = await serviceGetCompany(user.companyId);

  return { user, company, userCredential, message: 'Login is successfully!' };
}
