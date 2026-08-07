import { SchemaObjCxt } from 'ajv';
import { SCHEMA_NAME, isOneOfSeveral } from 'shared/lib/validators';
import { Condition } from '../../../types';


const conditions = Object.values(Condition);


export const isCondition = {
  keyword : 'isCondition',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: Condition) => isOneOfSeveral(conditions, data)
};
