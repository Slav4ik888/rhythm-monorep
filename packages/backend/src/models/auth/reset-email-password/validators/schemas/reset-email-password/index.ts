import { SCHEMA_NAME } from '../../../../../../libs/validators/ajv/schemas/schema-names';


export const schema = {
  $id                  : SCHEMA_NAME.RECOVERY_PASSWORD,
  type                 : 'object',
  required             : ['email'],
  additionalProperties : false,

  properties: {
    email: { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` }
  }
};
