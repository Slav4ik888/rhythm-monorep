import { PeriodType } from 'entities/dashboard-data';
import { ViewItemStyles } from './item-styles';


export interface PeriodItem {
  type      : PeriodType
  title     : string
  disabled? : boolean // Не показывать

}

export type Periods = {
  [key in PeriodType]: PeriodItem
}


export type PeriodStyleType = 'active' | 'normal'

export type PeriodStyles = {
  [key in PeriodStyleType]: ViewItemStyles
}
