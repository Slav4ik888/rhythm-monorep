import { Context } from '../../../../../app/types/global';
import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';



export const validateResetEmailPassword = (ctx: Context, email: string | undefined): void => {
  const { valid, errors } = validate(SCHEMA_NAME.RECOVERY_PASSWORD, { email });
  if (! valid) ctx.throw(400, errors);
}
