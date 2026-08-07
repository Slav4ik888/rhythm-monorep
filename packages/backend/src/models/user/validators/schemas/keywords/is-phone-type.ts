import { SchemaObjCxt } from 'ajv';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { PhoneType } from '../../../types';


const conditions = Object.values(PhoneType);


export const isPhoneType = {
  keyword : 'isPhoneType',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: PhoneType) => isOneOfSeveral(conditions, data)
};
