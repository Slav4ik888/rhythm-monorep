// packages/backend/src/models/auth/utils/check-is-not-free-email/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { ERR_CODE, getErrorMessage } from '../../../../views';
import { isNotFreeEmail } from '../is-not-free-email';

/** Проверяем свободен ли email и возвращаем ошибку если чо */
export const checkIsNotFreeEmail = async (email: string): Promise<void> => {
  const isNotFree = await isNotFreeEmail(email);
  if (isNotFree) {
    throw Object.assign(new Error('Email already exists'), {
      statusCode: 400,
      body: { email: getErrorMessage(ERR_CODE['auth/email-already-exists']) },
    });
  }
};
