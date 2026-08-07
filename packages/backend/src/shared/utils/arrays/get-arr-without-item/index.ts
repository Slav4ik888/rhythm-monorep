import { isObj } from '../../../../libs/validators';
import { objectLength as length, getFirstFieldKey as getKey } from '../../objects';
import type { Item, Items } from '../types';


/**
 * Возвращает массив без указанного элемента
 *  => if field === undefined & value length === 1, use field = field of value, else return items
 */
export function getArrWithoutItem(
  items  : Items,
  value  : Partial<Item> | string | number,
  field? : string
): Items {
  if (! items?.length) return [];
  if (! value) return items;

  if (isObj(items[0])) {
    if (isObj(value)) {
      if (field) return (items as Item[]).filter(item => item[field] !== (value as Partial<Item>)[field]);
      else {
        if (length(value as object) === 1) {
          const fieldValue = getKey(value as object);
          if (fieldValue) return (items as Item[]).filter(item => item[fieldValue] !== (value as Partial<Item>)[fieldValue])
        }
      }
    }
    else return (items as Item[]).filter(item => item[field as string] !== value);
  }
  else {
    if (typeof value !== 'object') return (items as Array<any>).filter(item => (item as unknown as string | number) !== value);
  }

  return items;
};
