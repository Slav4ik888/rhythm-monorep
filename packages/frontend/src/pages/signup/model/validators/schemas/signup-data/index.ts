import { SCHEMA_NAME } from 'shared/lib/validators/ajv';


export const schema = {
  $id                  : SCHEMA_NAME.SIGNUP_DATA,
  type                 : 'object',
  required             : ['firstName', 'email', 'password', 'confirmPassword', 'permissions', 'isMobile', 'partnerId'],
  additionalProperties : false,

  properties: {
    email           : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` },
    password        : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/password` },
    confirmPassword : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/confirmPassword` },

    companyName     : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/companyName` },

    firstName: {
      type      : 'string',
      minLength : 1,
      maxLength : 30
    },
    secondName      : { $ref: `${SCHEMA_NAME.DEFS_FIO}#/definitions/secondName` },
    middleName      : { $ref: `${SCHEMA_NAME.DEFS_FIO}#/definitions/middleName` },

    phoneNumber     : { $ref: `${SCHEMA_NAME.DEFS_PHONE}#/definitions/number` },

    // Разрешения на обработку персональных данных
    permissions: {
      const: true
    },

    partnerId  : { $ref: `${SCHEMA_NAME.DEFS_USER}#/definitions/partnerId` },

    // С какого устройства вошёл
    isMobile: {
      type: 'boolean'
    }
  }
};
