import { ViewItem } from 'entities/dashboard-view';


/**
 * Проверяет, что график линейный.
 * Если индекс не указан, то проверяет первый график
 */
export const isLine = (
  selectedItem : ViewItem | undefined,
  index        : number = 0
): boolean => selectedItem?.settings?.charts?.[index]?.chartType === 'line';


/**
 * Проверяет, что график не линейный.
 * Если индекс не указан, то проверяет первый график
 */
export const isNotLine = (selectedItem: ViewItem | undefined, index?: number): boolean => ! isLine(selectedItem, index);
