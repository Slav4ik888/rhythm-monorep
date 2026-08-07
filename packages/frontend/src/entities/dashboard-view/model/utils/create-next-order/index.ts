import { ORDER_STEP } from '../../../consts';



/** Создаёт следующий order в массиве, по порядку */
export function createNextOrder<T extends { order: number }>(childrenViewItems: T[] | undefined): number {
  let maxOrder = ORDER_STEP;

  if (! childrenViewItems || ! childrenViewItems.length) return maxOrder

  // Вычисляем максимальный order
  childrenViewItems.forEach((item) => {
    maxOrder = Math.max(maxOrder, item?.order || 0);
  });

  return maxOrder + ORDER_STEP; // К максимальному прибавляем минимальное значение для шага
}
