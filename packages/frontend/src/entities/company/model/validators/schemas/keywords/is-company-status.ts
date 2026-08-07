import { SchemaObjCxt } from 'ajv';
import { CompanyStatus } from '../../../../types';
import { isOneOfSeveral, SCHEMA_NAME } from 'shared/lib/validators';


const conditions = Object.values(CompanyStatus);


export const isCompanyStatus = {
  keyword : 'isCompanyStatus',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: CompanyStatus) => isOneOfSeveral(conditions, data)
};
