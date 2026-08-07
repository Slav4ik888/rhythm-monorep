import { DashboardPeriod, DashboardPeriodDateType } from '../../types';



export interface SetActivePeriod {
  companyId : string
  period    : DashboardPeriod
}

export interface SetSelectedPeriod {
  companyId : string
  dateType? : DashboardPeriodDateType
  period    : Partial<DashboardPeriod>
}
