import Ajv from 'ajv';
import { isCondition } from '../../../../../models/base/validators/schemas';
import { isCompanyStatus } from '../../../../../models/company/validators/schemas';
import { isPhoneNumberScheme, isCountryCode, isPhoneType, isRole, isUserStatus } from '../../../../../models/user/validators/schemas';


export const addKeywords = (ajv: Ajv) => {
  ajv
    // Base
    // @ts-ignore
    .addKeyword(isCondition)

    // Company
    // @ts-ignore
    .addKeyword(isCompanyStatus)

    // User
    // @ts-ignore
    .addKeyword(isCountryCode)
    // @ts-ignore
    .addKeyword(isPhoneNumberScheme)
    // @ts-ignore
    .addKeyword(isPhoneType)
    // @ts-ignore
    .addKeyword(isRole)
    // @ts-ignore
    .addKeyword(isUserStatus)
};
