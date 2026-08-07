import { DashboardStatisticItem } from 'entities/dashboard-data';
import { ViewItem } from 'entities/dashboard-view';
import { toNumber } from 'shared/helpers/numbers';
import { getBackgroundColors } from '../../../chartjs/lib';



export const getDoughnutOptions = (
  itemsData  : DashboardStatisticItem<number>[],
  viewItem   : ViewItem,
): Highcharts.Options => {
  const type = 'pie'; // viewItem.settings?.charts?.[0]?.chartType ||

  // Get "data"
  const data = [...itemsData.map((itemData, index) => {
    const length = itemData?.data?.length;

    // Последние значения соответствующие концу выбранного промежутка
    const value = (Array.isArray(itemData?.data) && length > 0)
      ? toNumber(itemData?.data[length - 1])
      : 0;

    const label = viewItem.settings?.charts?.[index]?.datasets?.label || '';

    return [label, value] // ['Norway', 16]
  })];

  // Get "innerSize"
  const cutout = viewItem?.settings?.charts?.[0]?.datasets?.cutout;
  const innerSize = cutout || 0;


  return {
    chart: {
      type,
      options3d: {
        enabled: true,
        alpha: 45
      },
      backgroundColor: 'transparent',
    },
    colors: getBackgroundColors(viewItem),
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    plotOptions: {
      pie: {
        innerSize,
        depth: 25
      }
    },
    series: [{
      type,
      name: '', // Название, показывается при наведении на "кусок" пирога
      dataLabels: {
        enabled: false // отключает подписи значений
      },
      data
    }]
  }
}
