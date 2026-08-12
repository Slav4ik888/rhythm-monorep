// packages/backend/src/models/auth/reset-email-password/validators/validate-reset-email-password/index.ts
// Рефакторинг: убран ctx, теперь выбрасывает ошибку с statusCode и body

import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';

export const validateResetEmailPassword = (email: string | undefined): void => {
  const { valid, errors } = validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email });
  if (!valid) {
    throw Object.assign(new Error('Validation failed'), { statusCode: 400, body: errors });
  }
};
