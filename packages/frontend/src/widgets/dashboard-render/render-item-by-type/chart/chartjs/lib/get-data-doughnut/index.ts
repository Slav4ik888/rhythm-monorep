import { ChartConfig } from 'entities/charts';
import { DashboardStatisticItem } from 'entities/dashboard-data';
import { ViewItem } from 'entities/dashboard-view';
import { getBackgroundColors } from './utils';



/**
 * Наполняет datasets всеми необходимыми даннными для Doughnut
 */
export const getDataDoughnut = (
  itemsData : DashboardStatisticItem<number>[],
  viewItem  : ViewItem
): ChartConfig => {
  const config: ChartConfig = {
    labels: viewItem?.settings?.charts?.map((item) =>  // ['Red', 'Blue', 'Yellow']
       item?.datasets?.label || ''
    ) || [''],

    datasets: [
      {
        label: '', // Chart name is added to each value by hover
        data: [...itemsData.map(itemData =>
          // последние значения соответствующие концу выбранного промежутка
          // eslint-disable-next-line no-unsafe-optional-chaining
          itemData?.data?.[itemData?.data?.length - 1] || 0
        )],
        backgroundColor: getBackgroundColors(viewItem),
        borderWidth: 0,
        hoverOffset: 8
      },
    ],
  };

  if (viewItem?.settings?.charts?.[0]?.datasets?.cutout) {
    config.datasets[0].cutout = viewItem.settings.charts[0].datasets.cutout
  }

  return config
}
