import { PartialViewItemUpdate } from 'shared/api/features/dashboard-view';
import { BunchesUpdated } from 'shared/lib/structures/bunch';



/**
 * Выбирает все уникальные bunchId, создаёт BunchesUpdated, добавляя bunchUpdatedMs */
export const getBunchesTimestamps = (items: PartialViewItemUpdate[], bunchUpdatedMs: number): BunchesUpdated => {
  const bunchMap: BunchesUpdated = {};

  items?.forEach(item => {
    const { bunchId } = item;
    if (! bunchMap[bunchId]) {
      bunchMap[bunchId] = bunchUpdatedMs;
    }
  });

  return bunchMap
}
