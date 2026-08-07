import { StatisticPeriodType } from 'entities/statistic-type';
import { DashboardPeriodType } from '../constants/period';


export type DashboardPeriodDateType = 'start' | 'end'

/** Показывает положительные отрицательные или нулевые изменения */
export type Increased = 1 | -1 | 0


/** For chips: StatisticType | ConditionType */
export interface DashboardItemType {
  label       : string
  // periodMs    : number // Period between two value
  description : string // Tooltip
}

export interface DashboardPeriodDates {
  start : number | undefined
  end   : number | undefined
}

export interface DashboardPeriod extends DashboardPeriodDates {
  type     : DashboardPeriodType // Выбранный тип
  // prevType : DashboardPeriodType // Предыдущий тип
}

export type DashboardItemData<T> = Array<T>

export interface DashboardStatisticItem<T = string | number> {
  kod         : string               // #kod
  periodType  : StatisticPeriodType  // #periodType - тип периодичности статистики: мес | нед | мес (кален)
  companyType : string               // #companyType - по какой организации: Общая | Да-Телеком | Badcom
  productType : string               // #productType - тип продукта: Общая | Сопровождение | Курс | Ритм | Разработка | Конструктор
  title       : string               // #title - Название статистики / показателя
  data        : DashboardItemData<T> // Колонка с данными
}

// export type GetDashboardData = Omit<DashboardData, 'lastUpdated'>
