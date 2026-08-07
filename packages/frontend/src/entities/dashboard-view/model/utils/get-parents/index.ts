import { ViewItem } from '../../../types';



export interface ParentsViewItems {
  [parentId: string]: ViewItem[]
}

/**
 * Объект с родителями, а внутри родителя все его дети
 * Returns object ParentsViewItems {
 *   [parentId: string]: ViewItem[]
 * }
 */
export const getParents = (items: ViewItem[]): ParentsViewItems => {
  const parents: ParentsViewItems = {};
  if (! items || ! items.length) return parents;

  items.forEach(item => {
      if (! parents[item.parentId]) {
        parents[item.parentId] = [];
      }
      parents[item.parentId].push(item);
  });

  return parents;
}
