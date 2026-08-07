import { isNotNum, isNotStr } from '../../../../libs/validators';
import { getArrWithoutItem } from '../get-arr-without-item';
import type { Item, Items } from '../types';


export function getArrWithoutItemById(items: Items, value: string | number): Items {
  if (isNotStr(value) && isNotNum(value)) return items;

  return getArrWithoutItem(items, { id: value } as unknown as Partial<Item>)
};
