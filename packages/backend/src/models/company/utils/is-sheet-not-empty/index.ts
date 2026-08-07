import { NO_PARENT_ID } from '../../../dashboard-view/consts';
import { ViewItem } from '../../../dashboard-view/types';


/**
 * Проверка наличия вложенных ViewItems
 * Только для корневых элементов (parentId === NO_PARENT_ID)
 */
export const isSheetNotEmpty = (
  viewItems        : ViewItem[],
  dashboardSheetId : string | undefined // Текущий sheetId
) => {
  if (! viewItems?.length) return false;

  return viewItems.find(item => item.sheetId === dashboardSheetId && item.parentId === NO_PARENT_ID);
}
