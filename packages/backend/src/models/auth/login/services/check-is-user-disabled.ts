// packages/backend/src/models/auth/login/services/check-is-user-disabled.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { getErrorMessage } from '../../../../views';
import { ERR_CODE } from '../../../../views/errors';
import { admin } from '../../../../libs/firebase';

/** Проверяем является ли пользователь удалённым (отключенным) */
export async function checkIsUserDisabled(email: string | undefined): Promise<any> {
  if (!email) {
    throw Object.assign(new Error('Invalid email'), {
      statusCode: 400,
      body: { email: getErrorMessage(ERR_CODE.InvalidEmail) },
    });
  }

  const userRecord = await admin.auth().getUserByEmail(email);
  if (userRecord.disabled) {
    throw Object.assign(new Error('Account disabled'), {
      statusCode: 400,
      body: { email: getErrorMessage(ERR_CODE.AccountDisabled) },
    });
  }
}
