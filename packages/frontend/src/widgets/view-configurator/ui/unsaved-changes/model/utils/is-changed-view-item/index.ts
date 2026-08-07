import { Company } from 'entities/company';
import { ViewItem } from 'entities/dashboard-view';
import { isNotEmpty } from 'shared/helpers/objects';
import { __devLog } from 'shared/lib/tests/__dev-log';


/** Есть ли не сохранённые изменения в SelectedItem */
export const isChangedViewItem = (
  selectedId       : string,
  changedCompany   : Partial<Company>,
  changedViewItem  : Partial<ViewItem>,
  __devShowConsole? : boolean // чтобы не во всех компонентах, где используется, выводился в консоль
): boolean => {
  if (! selectedId) return false;

  if (isNotEmpty(changedCompany)) return true
  if (isNotEmpty(changedViewItem)) {
    if (__devShowConsole) {
      __devLog('isChangedViewItem', 'changedViewItem');
      __devLog(changedViewItem);
    }
    return true
  }
  return false
};
