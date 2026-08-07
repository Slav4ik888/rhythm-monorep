import { PartialViewItem, ViewItem } from 'entities/dashboard-view';
import { cloneObj, setValueByScheme } from 'shared/helpers/objects';

/**
 * Подготавливает данные и сохраняет с помощью переданной ф-ии
 * подходит для схем с массивами 'settings.charts.[index]....'
 */
export const updater = (
  newValue        : any,
  selectedItem    : ViewItem | undefined,
  scheme          : string,
  updateViewItems : (items: PartialViewItem[]) => void
): void => {
  if (! selectedItem) return;

  let result: PartialViewItem = {
    id: selectedItem.id
  };

  if (scheme.includes('[')) { // scheme = 'settings.charts.[index]...'
    result = cloneObj(selectedItem);
  }
  setValueByScheme(result, scheme, newValue);
  updateViewItems([result]);
};
