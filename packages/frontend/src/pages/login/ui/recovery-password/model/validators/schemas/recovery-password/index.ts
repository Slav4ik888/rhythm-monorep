import { SCHEMA_NAME } from 'shared/lib/validators/ajv';


export const schema = {
  $id                  : SCHEMA_NAME.RECOVERY_PASSWORD,
  type                 : 'object',
  required             : ['email'],
  additionalProperties : false,

  properties: {
    email: { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` }
  }
};
