import { DashboardDataDates, DashboardStatisticItem } from 'entities/dashboard-data';
import { StatisticPeriodType } from 'entities/statistic-type';
import { getGreatestPeriodType } from '../get-greatest-period-type';



interface PrepareDatesForGreatestPeriod {
  dates: number[]
  greatestPeriodType: StatisticPeriodType
}


export const prepareDatesForGreatestPeriod = (
  allActiveDates : DashboardDataDates,
  itemsData      : DashboardStatisticItem<number>[],
): PrepareDatesForGreatestPeriod => {
  // - [] из всех periodType in itemsData
  const periodTypesSet = new Set<StatisticPeriodType>();
  itemsData.forEach(itemData => {
    if (itemData) periodTypesSet.add(itemData.periodType);
  });

  const periodTypes: StatisticPeriodType[] = Array.from(periodTypesSet);

  // - По ним activeDates
  const activeDates = periodTypes.reduce((acc, periodType) => {
    acc[periodType] = [...allActiveDates[periodType]] || [];
    return acc;
  }, {} as Record<StatisticPeriodType, number[]>);

  const greatestPeriodType = getGreatestPeriodType(activeDates, periodTypes);

  return {
    greatestPeriodType,
    dates: activeDates[greatestPeriodType]
  }
}
