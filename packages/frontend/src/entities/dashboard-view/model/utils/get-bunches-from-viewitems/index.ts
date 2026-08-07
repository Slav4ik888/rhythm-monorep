import { BunchesViewItem, ViewItem } from '../../../types';



/**
 * Создаёт BunchesViewItem из ViewItem[]
 */
export function getBunchesFromViewItems(viewItems: ViewItem[]): BunchesViewItem {
  if (! viewItems || ! viewItems.length) return {};

  return viewItems.reduce((acc, item) => {
    if (! acc[item.bunchId]) acc[item.bunchId] = {};

    acc[item.bunchId] = {
      ...acc[item.bunchId],
      [item.id]: item
    };

    return acc;
  }, {} as BunchesViewItem);
}
