import { Context } from 'koa';
import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { AuthByLogin } from '../../types';



export const validateAuthByLogin = (ctx: Context, data: AuthByLogin | undefined): void => {
  const { valid, errors } = validate(SCHEMA_NAME.AUTH_BY_LOGIN, data);
  if (! valid) ctx.throw(400, errors);
}
