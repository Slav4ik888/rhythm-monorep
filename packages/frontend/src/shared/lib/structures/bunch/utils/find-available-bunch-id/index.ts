
/**
 * Находит bunchId с количеством элементов < 100
 * @param items ViewItem[] | Tempale[]
 * @param maxCount Максимальное кол-во элементов в bunch // 100 - ViewItem[] | 10 - Template[]
 * @param freeCount Требуемое кол-во свободного места
 * @returns Первый найденный bunchId с <100 элементов или undefined
 */
export function findAvailableBunchId<T extends { bunchId: string }>(
  items     : T[],
  maxCount  : number,
  freeCount : number = 1
): string | undefined {
  const bunchCounts = items.reduce((acc, item) => {
    acc.set(item.bunchId, (acc.get(item.bunchId) || 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Array.from(bunchCounts.entries())
    .find(([_, count]) => count < (maxCount - freeCount + 1))?.[0];
}
