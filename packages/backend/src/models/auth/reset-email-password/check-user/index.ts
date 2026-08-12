// packages/backend/src/models/auth/reset-email-password/check-user/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { ERR_CODE, getErrorMessage } from '../../../../views';
import { serviceFindUserByEmail } from '../../../user';

/** Проверяем есть ли такой пользователь в базе, если нет, то выпадет ошибка */
export const checkUser = async (email: string | undefined) => {
  if (!email) {
    throw Object.assign(new Error('Invalid email'), {
      statusCode: 400,
      body: { email: getErrorMessage(ERR_CODE.InvalidEmail) },
    });
  }

  const user = await serviceFindUserByEmail(email);
  if (!user) {
    throw Object.assign(new Error('User not found'), {
      statusCode: 400,
      body: { email: getErrorMessage(ERR_CODE['auth/user-not-found']), label: email },
    });
  }
};
