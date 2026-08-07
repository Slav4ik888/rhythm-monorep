import Ajv from 'ajv';
import { schemaResetEmailPassword } from '../../../../../models/auth/reset-email-password/validators/schemas';
import { schemaAuthByLogin } from '../../../../../models/auth/login/validators/schemas';
import { schemaSignupData, schemaSignupDataEnd } from '../../../../../models/auth/signup/validators/schemas';
import { defsItemBase, schemaFixDate } from '../../../../../models/base/validators/schemas';
import { defsCompany, schemaCompany } from '../../../../../models/company/validators/schemas';
import {
  defsFIO, defsPhone, defsUser, schemaPhoneNumber, schemaPosition,
  schemaUser, defsPerson, schemaPerson, schemaSettings
} from '../../../../../models/user/validators/schemas';
import { defsBase } from '../../schemas';



export const addSchemas = (ajv: Ajv) => {
  ajv
    .addSchema([
      defsBase,

      // UI
      schemaFixDate,
      defsItemBase,

      // Auth
      schemaAuthByLogin,
      schemaResetEmailPassword,
      schemaSignupData,
      schemaSignupDataEnd,

      // User
      defsFIO,
      defsPhone,
      defsUser,
      defsPerson,
      schemaPerson,
      schemaPhoneNumber,
      schemaPosition,
      schemaSettings,
      schemaUser,

      // Company
      defsCompany,
      schemaCompany,
    ])
};
