import { Context } from 'koa';
import { validate } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { SignupData } from '../../types';


export const validateSignupData = (ctx: Context, data: SignupData): void => {
  const { valid, errors } = validate(SCHEMA_NAME.SIGNUP_DATA, data);
  if (! valid) ctx.throw(400, errors);
};
