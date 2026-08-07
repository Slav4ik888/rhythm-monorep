import { DashboardViewEntities, ViewItem, getFirstItemInBranchWithGlobalKod } from 'entities/dashboard-view';


/**
 * Если в item установлен fromGlobalKod, то inverted берётся в вышестоящем родителе (globalInverted).
 * Если родитель отсутствует, то возвращается значение из item.
 */
export const getInverted = (
  item     : ViewItem,
  entities : DashboardViewEntities,
) => {
  if (item.settings?.fromGlobalKod) {
    const globalItem = getFirstItemInBranchWithGlobalKod(entities, item.id);

    if (globalItem) return Boolean((globalItem as ViewItem).settings?.globalInverted)
  }

  return Boolean(item.settings?.inverted);
};
