import { ViewItemChartField, ViewItemChart } from 'entities/charts';
import { ViewItem } from '../../../types';


export const updateChartsItem = (
  item        : ViewItem,
  index       : number,
  fieldItem   : ViewItemChartField,
  updatedItem : any
): ViewItemChart[] => {
  const oldCharts = item.settings?.charts || [];

  return [
    ...oldCharts.slice(0, index),
    { ...oldCharts[index], [fieldItem]: updatedItem },
    ...oldCharts.slice(index + 1)
  ];
}
