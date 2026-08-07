import { DashboardViewEntities } from '../../slice/state-schema';
import { ViewItemId } from '../../../types';
import { getParentBranch } from '../get-parent-branch';

export function isFirstGlobalKodInBranch(
  entities   : DashboardViewEntities,
  selectedId : ViewItemId,
  targetId   : ViewItemId,
): boolean {
  const branch = getParentBranch(entities, selectedId);
  if (! branch || ! branch.length) return false;

  // Ищем первого родителя с isGlobalKod === true в ветке
  /* eslint-disable-next-line */
  for (const parentId of branch) {
    const parent = entities[parentId];
    if (parent?.settings?.isGlobalKod) {
      return parentId === targetId; // true, если targetId — это и есть этот родитель
    }
  }

  return false; // Ни у кого в ветке нет isGlobalKod === true
}
