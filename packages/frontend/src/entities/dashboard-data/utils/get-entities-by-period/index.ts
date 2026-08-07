import { DashboardPeriodDates, DashboardStatisticItem } from '../../types';
import { getStartIdx } from './get-start-idx';
import { getEndIdx } from './get-end-idx';
import { DashboardDataDates, DashboardDataEntities } from '../../model/slice/state-schema';



export interface PayloadGetEntitiesByPeriod {
  activeEntities : DashboardDataEntities
  activeDates    : DashboardDataDates
}


/** Returns startEntities & startDates by period  */
export function getEntitiesByPeriod(
  startEntities : DashboardDataEntities,
  startDates    : DashboardDataDates,
  period        : DashboardPeriodDates
): PayloadGetEntitiesByPeriod {
  const activeEntities: DashboardDataEntities = {};
  const activeDates: DashboardDataDates = {};


  // Обрабатываем каждую вкладку
  /* eslint-disable no-restricted-syntax */
  for (const periodType in startDates) {
    if (Object.prototype.hasOwnProperty.call(startDates, periodType)) {
      const startIdx = getStartIdx(startDates[periodType], period);
      const endIdx   = getEndIdx(startDates[periodType], period);
      activeDates[periodType] = [...startDates[periodType].slice(startIdx, endIdx + 1)];

      // Перебрать все startEntities и для текущего periodType обрезать нужный период дат
      /* eslint-disable no-restricted-syntax */
      for (const kod in startEntities) {
        if (Object.prototype.hasOwnProperty.call(startEntities, kod)) {
          if (startEntities[kod].periodType === periodType) {
            activeEntities[kod] = {} as DashboardStatisticItem;
            activeEntities[kod] = { ...startEntities[kod] };
            activeEntities[kod].data = [...startEntities[kod].data.slice(startIdx, endIdx + 1)];
          }
        }
      }
    }
  }

  return {
    activeEntities,
    activeDates
  }
}
