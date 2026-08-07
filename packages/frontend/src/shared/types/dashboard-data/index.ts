import { DashboardDataEntities, DashboardDataDates } from 'entities/dashboard-data';


export type GoogleSheetData = Array<Array<string | number>>

export interface ResGetData {
  [k: string]: GoogleSheetData
}

export interface StartEntitiesData {
  startEntities : DashboardDataEntities
  startDates    : DashboardDataDates
}

export interface ResGetGoogleData {
  companyId : string
  data      : StartEntitiesData
}

export interface ReqGetGoogleData {
  companyId        : string
  dashboardSheetId : string // For check доступ (для неавторизованных)
}
