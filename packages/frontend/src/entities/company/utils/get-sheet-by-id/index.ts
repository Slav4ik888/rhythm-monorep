import { DashboardSheets } from '../../types';

export const getSheetById = (
  paramsSheets : DashboardSheets,
  sheetId      : string
) => Object.values(paramsSheets).find(sheet => sheet.id === sheetId)
