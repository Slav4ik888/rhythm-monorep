import { ChartConfigOptions, ChartType } from 'entities/charts';
import { getBarOptions } from './get-bar-options';
import { getDoughnutOptions } from './get-doughnut-options';
import { getLineOptions } from './get-line-options';



export const getOptions = (type: ChartType, options: ChartConfigOptions): ChartConfigOptions => {
  switch (type) {
    case 'line': return getLineOptions(options)
    case 'bar': return getBarOptions(options)
    case 'pie':
    case 'doughnut': return getDoughnutOptions(options)

    default: return getLineOptions(options)
  }
}
