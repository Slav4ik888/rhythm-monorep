import { Errors } from 'shared/lib/validators';
import { DashboardPeriod, DashboardStatisticItem } from '../../types/dashboard';



export interface DashboardDataEntities {
  [kod: string]: DashboardStatisticItem
}

export interface DashboardDataDates {
  [periodType: string]: number[]
}


// STATE
export interface StateSchemaDashboardData {
  loading        : boolean
  errors         : Errors
  _isMounted     : boolean // Признак того, что Reducer mounted

  // Загруженные данные из гугл-таблицы
  startEntities  : DashboardDataEntities
  startDates     : DashboardDataDates
  lastUpdated    : number | undefined // Дата последнего обновления (загрузки из гугл)

  // Отфильтрованные по периоду дат activePeriod
  selectedPeriod : DashboardPeriod       // Выбранный на панели, но не активированный период дат
  activePeriod   : DashboardPeriod       // Текущий период, по которому отрисованы графики
  activeEntities : DashboardDataEntities
  activeDates    : DashboardDataDates    //
}
