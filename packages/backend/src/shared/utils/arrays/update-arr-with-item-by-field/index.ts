import { isArr } from '../../../../libs/validators';
import { cloneObj, updateObject } from '../../objects';
import type { Item } from '../types';



/**
 * v.2024-03-26
 * Возвращает массив с обновлённым item
 * Если нет массива items, то создаёт его
 * 
 * @param {Item} items 
 * @param {string} field - 
 * @param {object} updateItem 
 * @param {string | array} flags - 
 * @return {array} items 
 */
export function updateArrWithItemByField(
  items      : Item[],
  field      : string,          // поле по которому ищется объект: 'id' || 'email' || any
  updateItem : Partial<Item>,
  flags?     : string | string[] // - если стоит 'update', то в обновляемом объекте, обновляются только 
                                 //   те поля что переданы в updateItem, остальные имеющиеся остаются без изменений
                                 // - если есть 'after', то следующий нужно добавить id элемента после которого нужно добавить updateItem,
                                 //   ['after', 'id-123']
                                 //   если updateItem уже есть то просто обновляем, если его нет, то добавляем после after
): Item[] {
  if (! updateItem) return items

  let newItems = [] as Item[];

  // Если нет массива items, то создаём его
  if (! items) { 
    newItems.push(updateItem as Item);
    return newItems;
  }

  const idx = items.findIndex((item) => item[field] === updateItem[field]);
  newItems = [...items];

  // Если есть - обновляем
  if (idx !== -1) { 
    let newUpdateItem = cloneObj(updateItem);

    // Если указан флаг, обрабатываем
    if (flags?.includes('update')) {
      newUpdateItem = updateObject(items[idx], updateItem);
    }

    return [...newItems.slice(0, idx), newUpdateItem as Item, ...newItems.slice(idx + 1)];
  }
  // Нету - добавляем
  else {
    // If flags is array
    if (isArr(flags as string[])) {
      const idxAfter = (flags as string[])?.findIndex((str) => str === 'after');

      // If flags contains id after 'after'
      const afterId = flags?.[idxAfter + 1];

      if (idxAfter !== -1 && afterId) {
        // Есть ли afterId in Arr
        const idxAfterInArr = items.findIndex((item) => item[field] === afterId);;

        // Add after 'after'
        if (idxAfterInArr !== -1) {
          return [...newItems.slice(0, idxAfterInArr + 1), cloneObj(updateItem) as Item, ...newItems.slice(idxAfterInArr + 1)];
        }
        // В конец
        else {

        }
      }
    }
    else {

    }

    newItems.push(updateItem as Item);
    return newItems;
  }
};
