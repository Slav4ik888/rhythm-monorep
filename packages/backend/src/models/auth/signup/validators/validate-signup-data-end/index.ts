// packages/backend/src/models/auth/signup/validators/validate-signup-data-end/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { SignupDataEnd } from '../../types';

export const validateSignupDataEnd = (data: SignupDataEnd): void => {
  const { valid, errors } = validate(SCHEMA_NAME.SIGNUP_DATA_END, data);
  if (!valid) {
    throw Object.assign(new Error('Validation failed'), { statusCode: 400, body: errors });
  }
};
