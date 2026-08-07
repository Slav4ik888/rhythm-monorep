import { StatisticPeriodType } from 'entities/statistic-type';



/** Get max length periodType = activeDates[greatestPeriod] */
export const getGreatestPeriodType = (
  activeDates : Record<StatisticPeriodType, number[]>,
  periodTypes : StatisticPeriodType[],
): StatisticPeriodType => {
  let greatestPeriod = periodTypes[0];
  periodTypes.forEach(periodType => {
    if (activeDates[periodType].length > activeDates[greatestPeriod].length) {
      greatestPeriod = periodType;
    }
  });

  return greatestPeriod;
}
