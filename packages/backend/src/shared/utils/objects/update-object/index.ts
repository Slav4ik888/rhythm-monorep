import { isArrsEqual } from '../../arrays';
import { isArr, isObj, isUndefined, isNotObj } from '../../../../libs/validators';
import { cloneObj } from '../objects';
import { setValueByScheme } from '../set-value-by-scheme';



/**
 * Check updObj of new field, that absent in prevObj
 * Add new field to newObj
 */
const addNewField = (newObj: object, prevObj: object, updObj: object, prevScheme: string = ''): void => {
  if (isNotObj(updObj)) return
  
  for (const key in updObj) {
    const scheme = prevScheme ? `${prevScheme}.${key}` : key;

    if (Object.prototype.hasOwnProperty.call(updObj, key)) {
      // @ts-ignore
      const updValue = updObj[key];

      // @ts-ignore
      if (isUndefined(prevObj[key])) { // New field
        setValueByScheme(newObj, scheme, updValue);
        continue;
      }

      // @ts-ignore
      addNewField(newObj, prevObj[key], updValue, scheme);
    }
  }
};


/** Check is Array or any type and save */
const addChanges = (newObj: object, prevValue: unknown, updValue: unknown, scheme: string) => {
  if (isArr(prevValue as unknown as object[])) {
    if (! isArrsEqual(prevValue as unknown as object[], updValue as unknown as object[])) {
      setValueByScheme(newObj, scheme, updValue);
    }
  }
  else if (prevValue !== updValue) {
    setValueByScheme(newObj, scheme, updValue);
  }
};


/** Add changes */
const checkAndAddChanges = (newObj: object, prevObj: object, updObj: object, prevScheme: string = ''): void => {
  for (const key in prevObj) {
    const scheme = prevScheme ? `${prevScheme}.${key}` : key;

    if (Object.prototype.hasOwnProperty.call(prevObj, key)) {
      const
        // @ts-ignore
        value    = prevObj[key],
        // @ts-ignore
        updValue = updObj[key];

      if (isUndefined(updValue)) continue; // В этом элементе не было изменений

      if (isObj(value)) {
        checkAndAddChanges(newObj, value, updValue, scheme);
      }
      else {
        addChanges(newObj, value, updValue, scheme);
      }
    }
  }
};


/**
 * v.2023-05-19
 * Возвращает новый объект prevObj с обновлёнными полями из updFields
 * (который может содержать и другие поля, которых нет в prevObj)
 * Обновляет атомарно
 * Not deleted fields
 */
export function updateObject<T extends object, O extends Partial<T & any>>(
  prevObj   : T,
  updFields : O
): T & O | T {

  if (! prevObj && ! updFields) return {} as T;
  if (  prevObj && ! updFields) return prevObj;
  if (! prevObj &&   updFields) return updFields as unknown as T;

  const newObj = cloneObj(prevObj);

  // CHECK prevObj
  checkAndAddChanges(newObj, prevObj, updFields);
  
  // CHECK new field in updFields 
  addNewField(newObj, prevObj, updFields);

  return newObj;
};
