import { getValidResult, isNotStr } from 'shared/lib/validators';
import { DashboardSheet, DashboardSheets } from '../../../types';


export const validateDashboardSheetFields = (
  { title }: Partial<DashboardSheet>,
  paramsSheets: DashboardSheets
) => {
  if (! title || isNotStr(title)) return getValidResult({
    sheetTitle: 'Должно быть заполнено'
  });

  if (title.length > 50) return getValidResult({
    sheetTitle: 'Должно быть не более 50 символов'
  });

  const sheets = Object.values(paramsSheets);
  if (sheets.find(sheet => sheet.title === title)) return getValidResult({
    sheetTitle: 'Такое название уже существует'
  });

  return getValidResult()
}
