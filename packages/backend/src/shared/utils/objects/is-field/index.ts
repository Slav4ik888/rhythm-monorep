// packages/backend/src/shared/utils/objects/is-field/index.ts

import { isNotObj, isNotStr } from '../../../../libs/validators';

export function isField<T>(obj: T, field: string): boolean {
  if (!obj || isNotObj(obj) || !field || isNotStr(field)) return false;

  /* eslint-disable-next-line no-restricted-syntax, guard-for-in */
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (key === field) return true;
    }
  }

  return false;
}
