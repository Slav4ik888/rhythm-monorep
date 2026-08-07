import { RoutePath } from 'app/providers/routes'



export const getPathBySheetId = (
  companyId : string,
  sheetId?  : string
) => sheetId
    ? `/${companyId}/${RoutePath.DASHBOARD}/${sheetId}`
    : `/${companyId}/${RoutePath.DASHBOARD}`
