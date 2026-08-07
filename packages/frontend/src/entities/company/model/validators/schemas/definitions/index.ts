import { SCHEMA_NAME } from 'shared/lib/validators/ajv';


export const definitions = {
  $id  : SCHEMA_NAME.DEFS_COMPANY,
  type : 'object',

  definitions: {
    id          : { $ref: `${SCHEMA_NAME.DEFS_ITEM_BASE}#/definitions/id` },
    companyName : {
      type      : 'string',
      maxLength : 50
    },
    ownerId : { $ref: `${SCHEMA_NAME.DEFS_USER}#/definitions/id` },
    owner   : { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` },
    logoUrl : {
      type      : 'string',
      maxLength : 300
    },
    partnerCode: {
      type      : 'string',
      maxLength : 5
    },

    companyProfileMember: {
      type                 : 'object',
      required             : ['e', 'a'],
      additionalProperties : false,
      properties           : {
        e: { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` },
        a: {
          type                 : 'object',
          additionalProperties : false,
          properties           : {
            f: {
              type      : 'string',
              maxLength : 3
            }
          }
        }
      }
    },
    companyMembers: {
      type     : 'array',
      maxItems : 30,
      items: {
        $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/companyProfileMember`
      },
    },

    status: {
      isCompanyStatus: 'string'
    },

    createdAt  : { $ref: SCHEMA_NAME.FIX_DATE },
    lastChange : { $ref: SCHEMA_NAME.FIX_DATE },

    googleData : {
      type                 : 'object',
      required             : ['url'],
      additionalProperties : false,
      properties : {
        url: {
          type      : 'string',
          maxLength : 300
        }
      },
    },

    colorSettings: {
      type              : 'object',
      patternProperties : {
        '^.*$': { // Любой строковый ключ
          type                 : 'object',
          additionalProperties : false,
          properties           : {
            title: {
              type      : 'string',
              maxLength : 30
            },
            color: {
              type      : 'string',
              maxLength : 30
            },
            background: {
              type      : 'string',
              maxLength : 30
            }
          }
        }
      }
    },

    customSettings: {
      type                 : 'object',
      additionalProperties : false,
      properties           : {
        periodType  : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/colorSettings` },
        companyType : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/colorSettings` },
        productType : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/colorSettings` },
      },
    },

    bunchesUpdated: {
      type              : 'object',
      patternProperties : {
        '^.*$': { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/date` },
      }
    },

    sheets: {
      type             : 'object',
      patternProperties: {
        '^.*$': { // Любой строковый ключ
          type                 : 'object',
          additionalProperties : false,
          required             : ['id', 'title', 'type', 'order'],
          properties           : {
            id: {
              type      : 'string',
              maxLength : 50
            },
            type: {
              type : 'string',
              enum : ['collapse', 'title', 'divider']
            },
            title: {
              type      : 'string',
              maxLength : 50
            },
            iconId: {
              type      : 'string',
              maxLength : 50
            },
            noCollapse: {
              type: 'boolean'
            },
            href: {
              type      : 'string',
              maxLength : 100
            },
            route: {
              type      : 'string',
              maxLength : 50
            },
            order: {
              type: 'number',
            },
            createdAt  : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/createdAt` },
            lastChange : { $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/lastChange` },
          }
        }
      }
    },

    companyDashboardMember: {
      type                 : 'object',
      required             : ['e', 'a'],
      additionalProperties : false,
      properties           : {
        e: { $ref: `${SCHEMA_NAME.DEFS_BASE}#/definitions/email` },
        a: {
          type                 : 'object',
          additionalProperties : false,
          properties           : {
            f: {
              type      : 'string',
              maxLength : 3
            }
          }
        }
      }
    },
    dashboardMembers: {
      type     : 'array',
      maxItems : 30,
      items: {
        $ref: `${SCHEMA_NAME.DEFS_COMPANY}#/definitions/companyDashboardMember`
      },
    },

    dashboardPublicAccess: {
      type              : 'object',
      patternProperties : {
        '^.*$': { // Любой строковый ключ
          type: 'boolean',
        }
      },
      additionalProperties: false
    }
  }
};
