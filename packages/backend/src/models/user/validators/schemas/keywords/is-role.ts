import { SchemaObjCxt } from 'ajv';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { Role } from '../../../types';


const conditions = Object.values(Role);


export const isRole = {
  keyword : 'isRole',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: Role) => isOneOfSeveral(conditions, data)
};
