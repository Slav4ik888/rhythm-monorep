import { isObj } from '../../../../libs/validators';
import { isEmpty } from '..';

/**
 * v.2023-05-19
 * Convert object to dot notation like this
 * @example { first: { second: { third: 'field' }}} => { 'first.second.third': 'field' }
 */
export function convertToDot<O extends object>(obj: O): object {
  if (! obj || isEmpty(obj)) return {}

  const newObj = {};

  checkAndConvert(obj, newObj);

  return newObj;
}


function checkAndConvert<O extends object>(obj: O, newObj: object, prevScheme: string = ''): void {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const
        value  = obj[key],
        scheme = prevScheme ? `${prevScheme}.${key}` : key;

      if (isObj(value)) {
        checkAndConvert(value as unknown as object, newObj, scheme);
      }
      else {
        // @ts-ignore
        newObj[scheme] = value;
      }
    }
  }
}
