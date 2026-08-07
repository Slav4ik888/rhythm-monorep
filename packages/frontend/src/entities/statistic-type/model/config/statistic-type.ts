import { DashboardItemType } from 'entities/dashboard-data';
import { StatisticPeriodType } from '../types';



export const STATISTIC_PERIOD_TYPE: Record<StatisticPeriodType, DashboardItemType> = {
  day: {
    label       : 'Ден',
    // periodMs    : 1000 * 60 * 60 * 24, // Период в миллисекундах (пока вроде не использую)
    description : 'Ежедневная статистика'
  },
  week: {
    label       : 'Нед',
    // periodMs    : 1000 * 60 * 60 * 24 * 7,
    description : 'Недельная статистика'
  },
  month: {
    label       : 'Мес',
    // periodMs    : 1000 * 60 * 60 * 24 * 30,
    description : 'Месячная статистика'
  },
  month_cal: {
    label       : 'МеК',
    // periodMs    : 1000 * 60 * 60 * 24 * 30,
    description : 'Месячная статистика (по календарному месяцу)'
  }
}

export const arrayStatisticPeriodType = Array.from(Object.keys(STATISTIC_PERIOD_TYPE));
