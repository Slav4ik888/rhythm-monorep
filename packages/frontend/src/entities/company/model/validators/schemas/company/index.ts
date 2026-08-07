import { SCHEMA_NAME } from 'shared/lib/validators/ajv';


export const schema = {
  $id                  : SCHEMA_NAME.COMPANY,
  type                 : 'object',
  required             : ['id'],
  additionalProperties : false,

  properties: {
    id                    : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/id` },
    companyName           : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/companyName` },
    ownerId               : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/ownerId` },
    owner                 : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/owner` },

    logoUrl               : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/logoUrl` },
    status                : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/status` },
    companyMembers        : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/companyMembers` },
    partnerCode           : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/partnerCode` },
    createdAt             : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/createdAt` },
    lastChange            : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/lastChange` },

    // DASHBOARD`s
    googleData            : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/googleData` },
    customSettings        : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/customSettings` },
    bunchesUpdated        : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/bunchesUpdated` },
    sheets                : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/sheets` },
    dashboardMembers      : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/dashboardMembers` },
    dashboardPublicAccess : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/dashboardPublicAccess` },
  }
};
