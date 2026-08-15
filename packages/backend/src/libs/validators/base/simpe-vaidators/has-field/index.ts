// packages/backend/src/libs/validators/base/simpe-vaidators/has-field/index.ts

import { isNotObj } from '../is-obj';

/**
 * v.2023-05-08
 * True if the data has this field
 */
export const isHasField = (data: object, field: string): boolean => {
  // undefined/null — не объект, значит поля нет (иначе hasOwnProperty падает с TypeError)
  if (isNotObj(data)) return false;
  return Boolean(Object.prototype.hasOwnProperty.call(data, field));
};

export const isNotHasField = (data: object, field: string): boolean => !isHasField(data, field);
