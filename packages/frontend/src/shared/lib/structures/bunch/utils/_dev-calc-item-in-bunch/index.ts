import { ViewItem } from 'entities/dashboard-view';


/** Подсчитывает сколько items in bunch */
export const calcItemsInBunches = (items: ViewItem[]): Record<string, number> => {
  if (! items) return {}

  return items.reduce((acc, item) => {
    const bunchId = item.bunchId.slice(0, 5);
    if (! acc[bunchId]) {
      acc[bunchId] = 0;
    }
    acc[bunchId]++;
    return acc;
  }, {} as Record<string, number>);
};
