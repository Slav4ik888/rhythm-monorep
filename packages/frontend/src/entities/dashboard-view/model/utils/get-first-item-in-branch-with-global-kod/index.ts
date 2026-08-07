/* eslint-disable */
import { DashboardViewEntities } from '../../slice/state-schema';
import { ViewItem, ViewItemId } from '../../../types';
import { getParentBranch } from '../get-parent-branch';


/** Возвращает первого родителя с isGlobalKod === true в ветке */
export function getFirstItemInBranchWithGlobalKod(
  entities : DashboardViewEntities,
  targetId : ViewItemId | undefined,
): ViewItem | undefined {
  const branch = getParentBranch(entities, targetId);
  if (! branch || ! branch.length) return;

  // Ищем первого родителя с isGlobalKod === true в ветке
  for (const parentId of branch) {
    const parent = entities[parentId];
    if (parent?.settings?.isGlobalKod) return parent
  }

  // Ни у кого в ветке нет isGlobalKod === true
  return
}
