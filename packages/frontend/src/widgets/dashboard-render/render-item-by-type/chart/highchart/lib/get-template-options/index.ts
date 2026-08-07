import * as Highcharts from 'highcharts';
import { getTemplateDoughnutOptions } from './get-template-doughnut-options';
import { ViewItem } from 'entities/dashboard-view';



export const getTemplateOptions = (
  viewItem: ViewItem
): Highcharts.Options => {
  const type = viewItem.settings?.charts?.[0]?.chartType;

  switch (type) {
    // case 'line': return getLineOptions(options)
    // case 'bar': return getBarOptions(options)
    case 'pie':
    case 'doughnut': return getTemplateDoughnutOptions()

    default: return getTemplateDoughnutOptions()
  }
}
