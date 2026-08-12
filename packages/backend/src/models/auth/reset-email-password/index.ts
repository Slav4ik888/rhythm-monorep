// packages/backend/src/models/auth/reset-email-password/index.ts
// Рефакторинг: убран ctx, принимает email, возвращает результат

import { validateResetEmailPassword } from './validators';
import { checkUser } from './check-user';
import { sendLink } from './send-link';

export interface ResetEmailPasswordArgs {
  email: string;
}

export interface ResetEmailPasswordResult {
  message: string;
  success: boolean;
}

export async function resetEmailPasswordModel({ email }: ResetEmailPasswordArgs): Promise<ResetEmailPasswordResult> {
  const normalizedEmail = email || '';

  validateResetEmailPassword(normalizedEmail);
  await checkUser(normalizedEmail);

  const result = await sendLink(normalizedEmail);

  return {
    success: result,
    message: result
      ? `Ссылка для восстановления пароля отправлена на почту: ${normalizedEmail}`
      : `Произошла ошибка, не получилось отправить ссылку, на указанную почту: ${normalizedEmail}`,
  };
}
