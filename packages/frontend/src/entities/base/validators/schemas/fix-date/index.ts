import { SCHEMA_NAME } from 'shared/lib/validators/ajv/schemas/schema-names';


export const schema = {
  $id                  : SCHEMA_NAME.FIX_DATE,
  type                 : 'object',
  required             : ['userId', 'date'],
  additionalProperties : false,

  properties: {
    userId : { $ref: `${SCHEMA_NAME.DEFS_USER}#/definitions/id` },
    date   : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/date` }
  }
};
