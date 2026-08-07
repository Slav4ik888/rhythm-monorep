import { SCHEMA_NAME, validate, Validation } from 'shared/lib/validators';


export const validateRecoveryPassword = (email: string): Validation =>
  validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email });
