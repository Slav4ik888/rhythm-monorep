import * as Highcharts from 'highcharts';
import { getDoughnutOptions } from './get-doughnut-options';
import { DashboardStatisticItem } from 'entities/dashboard-data';
import { ViewItem } from 'entities/dashboard-view';



export const getOptions = (
  itemsData : DashboardStatisticItem<number>[],
  viewItem  : ViewItem
): Highcharts.Options => {
  const type = viewItem.settings?.charts?.[0]?.chartType;

  switch (type) {
    // case 'line': return getLineOptions(options)
    // case 'bar': return getBarOptions(options)
    case 'pie':
    case 'doughnut': return getDoughnutOptions(itemsData, viewItem)

    default: return getDoughnutOptions(itemsData, viewItem)
  }
}
