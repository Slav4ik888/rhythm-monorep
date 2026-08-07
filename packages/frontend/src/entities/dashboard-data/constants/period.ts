
export enum PeriodType {
  CUSTOM       = 'custom', // Авторасчёт Даты "С"
  ONE_WEEK     = 'one_week',
  ONE_MONTH    = 'one_month',
  THREE_MONTHS = 'three_months',
  SIX_MONTHS   = 'six_months',
  NINE_MONTHS  = 'nine_months',
  ONE_YEAR     = 'one_year',
  TWO_YEARS    = 'two_years',
  THREE_YEARS  = 'three_years',
  FIVE_YEARS   = 'five_years',
  SEVEN_YEARS  = 'seven_years',
  TEN_YEARS    = 'ten_years',
  ALL_TIME     = 'all_time',
}

export type DashboardPeriodType = Exclude<PeriodType, PeriodType.ALL_TIME>;

export const DASHBOARD_PERIOD_TEXT: Record<DashboardPeriodType, string> = {
  [PeriodType.CUSTOM]       : 'Произвольный', // Автосброс Даты "С"
  [PeriodType.ONE_WEEK]     : '1 неделя',
  [PeriodType.ONE_MONTH]    : '1 месяц',
  [PeriodType.THREE_MONTHS] : '3 месяца',
  [PeriodType.SIX_MONTHS]   : '6 месяцев',
  [PeriodType.NINE_MONTHS]  : '9 месяцев',
  [PeriodType.ONE_YEAR]     : '1 год',
  [PeriodType.TWO_YEARS]    : '2 года',
  [PeriodType.THREE_YEARS]  : '3 года',
  [PeriodType.FIVE_YEARS]   : '5 лет',
  [PeriodType.SEVEN_YEARS]  : '7 лет',
  [PeriodType.TEN_YEARS]    : '10 лет'
}

export const arrayDashboardPeriodType: DashboardPeriodType[] = Object.values(PeriodType).filter(
  (period): period is DashboardPeriodType => period !== PeriodType.ALL_TIME
);
// export const arrayDashboardPeriodType = Array.from(Object.values(DashboardPeriodType));
