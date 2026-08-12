// packages/backend/src/models/auth/login/validators/validate-auth-by-login/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { AuthByLogin } from '../../types';

export const validateAuthByLogin = (data: AuthByLogin | undefined): void => {
  const { valid, errors } = validate(SCHEMA_NAME.AUTH_BY_LOGIN, data);
  if (!valid) {
    throw Object.assign(new Error('Validation failed'), { statusCode: 400, body: errors });
  }
};
