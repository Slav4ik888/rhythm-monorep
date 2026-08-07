import { ChartConfig } from 'entities/charts';
import { ViewItem } from 'entities/dashboard-view';
import { getBackgroundColors } from '../get-data-doughnut/utils';



/**
 * For Templates
 * Наполняет datasets всеми необходимыми даннными для Doughnut
 */
export const getTemplateDataDoughnut = (
  viewItem  : ViewItem
): ChartConfig => {
  const config: ChartConfig = {
    labels: viewItem?.settings?.charts?.map((item) =>  // ['Red', 'Blue', 'Yellow']
       item?.datasets?.label || ''
    ) || [''],

    datasets: [
      {
        label: '', // Chart name is added to each value by hover
        data: [10, 20, 15, 75, 3, 13],
        backgroundColor: getBackgroundColors(viewItem),
        borderWidth: 0,
        hoverOffset: 8
      },
    ],
  };

  return config
}
