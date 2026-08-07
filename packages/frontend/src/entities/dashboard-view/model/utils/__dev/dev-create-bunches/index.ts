import { ViewItem, ViewItemId } from '../../../../types';
import { v4 as uuidv4 } from 'uuid';
import { Bunch } from 'shared/lib/structures/bunch';



/**
 * Разбивает массив ViewItem на гроздья (bunches) по 100 элементов
 * с одинаковым bunchId для всех элементов в каждой грозди
 * @param items - исходный массив ViewItem
 * @returns массив гроздьев (Bunch[])
 */
export function devCreateBunches(items: ViewItem[]): Bunch<ViewItemId, ViewItem>[] {
  const bunches: Bunch<ViewItemId, ViewItem>[] = [];
  const bunchSize = 100;
  const totalBunches = Math.ceil(items.length / bunchSize);

  // Создаём гроздьи с одинаковым bunchId для всех элементов
  Array(totalBunches).fill(null).forEach((_, bunchIndex) => {
    const bunchId = uuidv4();  // Один bunchId на всю гроздь
    const startIndex = bunchIndex * bunchSize;
    const endIndex = startIndex + bunchSize;
    const bunchItems = items.slice(startIndex, endIndex);

    const bunch: Bunch<ViewItemId, ViewItem> = {};
    bunchItems.forEach(item => {
      bunch[item.id] = {
        ...item,
        bunchId  // Устанавливаем одинаковый bunchId для всех элементов грозди
      };
    });

    if (Object.keys(bunch).length > 0) {
      bunches.push(bunch);
    }
  });

  return bunches;
}
