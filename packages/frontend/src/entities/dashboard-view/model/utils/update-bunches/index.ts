import { updateObject } from 'shared/helpers/objects';
import { BunchesViewItem, PartialBunchesViewItem } from '../../../types';



/**
 * Обновляет Bunches изменёнными PartialBunches
 * Кроме удаления. Если произошло удаление элемента, данная функция этого не обработает и элемент останется.
 */
export function updateBunches(
  lastBunches    : BunchesViewItem,
  changedBunches : PartialBunchesViewItem
): BunchesViewItem {
  if (! lastBunches) {
    if (! changedBunches) return {};
    return changedBunches as BunchesViewItem; // Значит должны передать не Partial, а BunchesViewItem
  }
  if (! changedBunches) return lastBunches;

  const updatedBunches = { ...lastBunches };

  Object.entries(changedBunches).forEach(([bunchId, bunch]) => {
    if (! updatedBunches[bunchId]) updatedBunches[bunchId] = {};

    updatedBunches[bunchId] = {
      ...updateObject(updatedBunches[bunchId], bunch)
    }
  })

  return updatedBunches
}
