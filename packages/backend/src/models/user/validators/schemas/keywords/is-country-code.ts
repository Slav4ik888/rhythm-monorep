import { SchemaObjCxt } from 'ajv';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { CountryCode } from '../../../types';


const conditions = Object.values(CountryCode);


export const isCountryCode = {
  keyword : 'isCountryCode',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: CountryCode) => isOneOfSeveral(conditions, data)
};
