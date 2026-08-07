import { PeriodType } from 'entities/dashboard-data';


export const INDIVIDUAL_PERIOD: Partial<Record<PeriodType, string>> = {
  [PeriodType.ONE_WEEK]     : '1 нед',
  [PeriodType.ONE_MONTH]    : '1 мес',
  [PeriodType.THREE_MONTHS] : '3 мес',
  [PeriodType.SIX_MONTHS]   : '6 мес',
  [PeriodType.NINE_MONTHS]  : '9 мес',
  [PeriodType.ONE_YEAR]     : '1 год',
  [PeriodType.TWO_YEARS]    : '2 года',
  [PeriodType.THREE_YEARS]  : '3 года',
  [PeriodType.FIVE_YEARS]   : '5 лет',
  [PeriodType.SEVEN_YEARS]  : '7 лет',
  [PeriodType.TEN_YEARS]    : '10 лет',
  [PeriodType.ALL_TIME]     : 'Весь период',
}

// export const arrayKeysIndividualPeriodLong = Object.keys(INDIVIDUAL_PERIOD_LONG);
// export const arrayIndividualPeriodLong     = Object.values(INDIVIDUAL_PERIOD_LONG);


// export const INDIVIDUAL_PERIOD_SHORT: Partial<Record<PeriodType, string>> = {
//   [PeriodType.ONE_WEEK]     : '1н',
//   [PeriodType.ONE_MONTH]    : '1м',
//   [PeriodType.THREE_MONTHS] : '3м',
//   [PeriodType.SIX_MONTHS]   : '6м',
//   [PeriodType.NINE_MONTHS]  : '9м',
//   [PeriodType.ONE_YEAR]     : '1г',
//   [PeriodType.TWO_YEARS]    : '2г',
//   [PeriodType.THREE_YEARS]  : '3г',
//   [PeriodType.FIVE_YEARS]   : '5л',
//   [PeriodType.SEVEN_YEARS]  : '7л',
//   [PeriodType.TEN_YEARS]    : '10л',
//   [PeriodType.ALL_TIME]     : 'Весь',
// }

// export const arrayIndividualPeriodShort = Object.values(INDIVIDUAL_PERIOD_SHORT);
