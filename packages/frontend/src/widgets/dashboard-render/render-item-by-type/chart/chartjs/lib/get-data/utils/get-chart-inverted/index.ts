import { DashboardViewEntities, ViewItem, getFirstItemInBranchWithGlobalKod } from 'entities/dashboard-view';


/**
 * Для item.type = 'chart'
 * Если для этого графика (по индексу) установлен fromGlobalKod, то inverted берётся в вышестоящем родителе (globalInverted).
 * Если родитель отсутствует, то возвращается значение из этого графика.
 */
export const getChartInverted = (
  item     : ViewItem,
  index    : number,
  entities : DashboardViewEntities,
) => {
  if (item.settings?.charts?.[index]?.fromGlobalKod) {
    const globalItem = getFirstItemInBranchWithGlobalKod(entities, item.id);

    if (globalItem) return Boolean((globalItem as ViewItem).settings?.globalInverted)
  }

  return Boolean(item.settings?.charts?.[index]?.inverted);
};
