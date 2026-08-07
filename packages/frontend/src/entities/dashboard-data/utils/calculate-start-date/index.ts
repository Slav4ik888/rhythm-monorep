/* eslint-disable */
import { PeriodType } from 'entities/dashboard-data'
import { __devLog } from 'shared/lib/tests/__dev-log';



interface ResSplitDate {
  year  : number
  month : number
  day   : number
}

/** Отдаёт объект с year, month, day */
const splitDate = (dateMs: number): ResSplitDate => {
  const dates = new Date(dateMs);

  return {
    year  : dates.getFullYear(),
    month : dates.getMonth(),
    day   : dates.getDate()
  }
}


/** Рассчитывает начальную дату по входящим параметрам */
const calcStartDate = (
  dateMs     : number | undefined,
  shiftYear  : number,
  shiftMonth = 0,
  shiftDay   = 0
): number | undefined => {
  if (! dateMs) return;

  const { year, month, day } = splitDate(dateMs);

  // const startDate = new Date(year + shiftYear, month + shiftMonth, day + 1 + shiftDay, 23, 59, 59, 999);
  const startDate = new Date(year + shiftYear, month + shiftMonth, day + 1 + shiftDay, 0, 0, 0, 1);
  // console.log('startDate: ', startDate);

  return startDate.getTime()
}



/** Рассчитывает стартовую дату */
export const calculateStartDate = (endDate: number | undefined, type: PeriodType): number | undefined => {
  // На период монтирования будет undefined
  if (! type) return;

  switch (type) {
    case PeriodType.ONE_WEEK:     return calcStartDate(endDate, 0, 0, -7);
    case PeriodType.ONE_MONTH:    return calcStartDate(endDate, 0, -1);
    case PeriodType.THREE_MONTHS: return calcStartDate(endDate, 0, -3);
    case PeriodType.SIX_MONTHS:   return calcStartDate(endDate, 0, -6);
    case PeriodType.NINE_MONTHS:  return calcStartDate(endDate, 0, -9);
    case PeriodType.ONE_YEAR:     return calcStartDate(endDate, -1);
    case PeriodType.TWO_YEARS:    return calcStartDate(endDate, -2);
    case PeriodType.THREE_YEARS:  return calcStartDate(endDate, -3);
    case PeriodType.FIVE_YEARS:   return calcStartDate(endDate, -5);
    case PeriodType.SEVEN_YEARS:  return calcStartDate(endDate, -7);
    case PeriodType.TEN_YEARS:    return calcStartDate(endDate, -10);
    // TODO: PeriodType.ALL_TIME

    default: __devLog('calculateStartDate', 'Unknown period type:', type)
  }
  return;
}
