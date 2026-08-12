// packages/backend/src/models/auth/signup/validators/validate-signup-data/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { SignupData } from '../../types';

export const validateSignupData = (data: SignupData): void => {
  const { valid, errors } = validate(SCHEMA_NAME.SIGNUP_DATA, data);
  if (!valid) {
    throw Object.assign(new Error('Validation failed'), { statusCode: 400, body: errors });
  }
};
