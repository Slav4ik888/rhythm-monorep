import { Context } from 'koa';
import { PartialCompany } from '../../types';
import { validate } from '../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../libs/validators/ajv/schemas/schema-names';


export const validateCompanyData = (ctx: Context, data: PartialCompany): void => {
  const { valid, errors } = validate(SCHEMA_NAME.COMPANY, data);
  if (! valid) ctx.throw(400, errors);
};
