import { ChartConfigDatasets } from 'entities/charts';
import { DashboardDataDates, DashboardStatisticItem } from 'entities/dashboard-data';
import { StatisticPeriodType } from 'entities/statistic-type';


/**
 * Опираясь на greatestPeriodType преобразует данные для построения графика
 *  1 - если periodType === greatestPeriodType данные отдаются как есть,
 *  - если нет, то даты из periodType подстраиваем под greatestPeriodType и определяем индекс для них
 *    (чтобы копировать данные для этого)
 *    иначе сравниваются даты в greatestPeriodType и в periodType,
 *    те данные по которым даты совпадают остаются, а там где не совпадают заменяются NaN-ами
 *  2 - к значениям прибавляется shiftValues (если нужно)
 */
export const prepareDataForChart = (
  itemData           : DashboardStatisticItem<number>,
  datasets           : ChartConfigDatasets, // Чтобы брать оттуда настройки, например для shiftValues
  allActiveDates     : DashboardDataDates,
  greatestPeriodType : StatisticPeriodType,
): number[] => {
  if (! itemData) return []

  // Подготавливаем данные при наличии shiftValues
  const data = itemData.data.map(value => datasets?.shiftValues ? (value + datasets.shiftValues) : value);

  // Если отличается от greatestPeriodType
  if (itemData.periodType === greatestPeriodType) return data

  const greatestDates = allActiveDates[greatestPeriodType];
  const itemDates = allActiveDates[itemData.periodType];

  // Индекс обработанной даты в itemDates
  let itemProcessedIdx = -1;

  const result = greatestDates.map(currentGreatestDate => {
    const dateInItemIdx = itemDates?.findIndex(dateInItem => dateInItem === currentGreatestDate);

    // 1 - Дата из periodType есть в DATE
    if (dateInItemIdx !== -1) {
      itemProcessedIdx = dateInItemIdx;
      return data[dateInItemIdx];
    }

    // 2 - Даты из periodType нет (не равна ни одной из) в DATE
    // 2-1 - Текущая необработанная дата из periodType < currentGreatestDate
    if (itemDates[itemProcessedIdx + 1] < currentGreatestDate) {
      itemProcessedIdx++;
      return data[itemProcessedIdx];
    }
    // 2-2 - Текущая необработанная дата из periodType > currentGreatestDate
    return NaN
  });

  return result
}
