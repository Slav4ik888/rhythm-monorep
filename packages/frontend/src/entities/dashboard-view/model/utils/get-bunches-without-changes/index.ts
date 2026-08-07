import { BunchesViewItem } from '../../../types';


/**
 * Возвращает Bunches из LocalStorage в которых не было изменений
 * @param changedBunches - id bunches в которых были изменения и их не нужно показывать
 * @param localBunches - Bunches из LocalStorage
 * @returns массив bunchId для обновления
 */
export function getBunchesWithoutChanges(
  changedBunches : string[],
  localBunches   : BunchesViewItem = {}
): BunchesViewItem {
  if (! localBunches) return {};

  return Object.entries(localBunches)
    .filter(([bunchId, bunch]) => {
      const changed = changedBunches.includes(bunchId);
      return changed ? false : bunch;
    })
    .reduce((acc, [bunchId, bunch]) => {
      acc[bunchId] = bunch;
      return acc;
    }, {} as BunchesViewItem);
}
