import { SchemaObjCxt } from 'ajv';
import { CompanyStatus } from '../../../types';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';



const conditions = Object.values(CompanyStatus);


export const isCompanyStatus = {
  keyword : 'isCompanyStatus',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: CompanyStatus) => isOneOfSeveral(conditions, data)
};
