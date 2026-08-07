import { SCHEMA_NAME } from '../../../../../../libs/validators/ajv/schemas/schema-names';


export const schema = {
  $id                  : SCHEMA_NAME.SIGNUP_DATA_END,
  type                 : 'object',
  required             : ['email', 'emailCode'],
  additionalProperties : false,

  properties: {
    email     : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` },
    emailCode : {
      type      : 'string',
      minLength : 6,
      maxLength : 6
    },
  }
};
