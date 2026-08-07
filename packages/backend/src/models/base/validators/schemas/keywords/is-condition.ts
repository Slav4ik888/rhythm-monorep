import { SchemaObjCxt } from 'ajv';
import { isOneOfSeveral } from '../../../../../libs/validators';
import { SCHEMA_NAME } from '../../../../../libs/validators/ajv/schemas/schema-names';
import { Condition } from '../../../types';


const conditions = Object.values(Condition);


export const isCondition = {
  keyword : 'isCondition',
  compile : (_schema: SCHEMA_NAME, _parentSchema: SCHEMA_NAME, it: SchemaObjCxt) =>
    (data: Condition) => isOneOfSeveral(conditions, data)
};
