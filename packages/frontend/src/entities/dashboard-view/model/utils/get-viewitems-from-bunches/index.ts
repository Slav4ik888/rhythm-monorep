import { BunchesViewItem, ViewItem } from '../../../types';


/**
 * Возвращает ViewItems из Bunches
 */
export function getViewitemsFromBunches(bunches: BunchesViewItem): ViewItem[] {
  if (! bunches) return [];

  const viewitems: ViewItem[] = [];

  Object.values(bunches).forEach(oneBunch => {
    Object.values(oneBunch).forEach(item => {
      viewitems.push(item);
    })
  });

  return viewitems;
}
