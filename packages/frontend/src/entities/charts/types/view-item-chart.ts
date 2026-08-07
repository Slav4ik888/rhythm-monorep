import { ChartConfigDatasets, ChartConfigTrendDatasets } from './chart-config';
import { ChartType } from './chart-types';



/** v.2025-05-05 */
export interface ViewItemChart {
  kod?           : string
  fromGlobalKod? : boolean // Если true, то Глобальны kod, будет автоматически подтягиваться в этот элемент
  inverted?      : boolean // График перевёрнутый, пример - если задолженность уменьшается то это рост
  chartType?     : ChartType
  datasets?      : ChartConfigDatasets
  isTrend?       : boolean // Показывать ли линию тренда
  trendDataSets? : ChartConfigTrendDatasets
}

export type ViewItemChartField = keyof ViewItemChart
