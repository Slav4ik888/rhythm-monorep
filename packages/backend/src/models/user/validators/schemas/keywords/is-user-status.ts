import { SchemaObjCxt } from 'ajv';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { UserStatus } from '../../../types';


const conditions = Object.values(UserStatus);


export const isUserStatus = {
  keyword:  'isUserStatus',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: UserStatus) => isOneOfSeveral(conditions, data)
};
