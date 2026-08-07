import { ViewItemStyles, ViewItem } from 'entities/dashboard-view';



/**
 * Обновляет стили элемента, сначала обнуляя старые стили, затем применяя новые
 * @param {ViewItem} selectedItem - элемент, стили которого нужно обновить
 * @param {ViewItem} copiedItem - Объект с новыми стилями (например, {color: 'red', fontSize: '16px'})
 */
export function updateStyles(selectedItem: ViewItem, copiedItem: ViewItem): ViewItemStyles {
  // Получаем текущие стили элемента (или пустой объект, если styles undefined)
  const oldStyles = selectedItem?.styles || {};
  const copiedStyles = copiedItem?.styles || {};

  const updatedStyles = { ...oldStyles };

  // Обнуляем все существующие стили
  Object.keys(oldStyles).forEach(property => {
    // @ts-ignore
    updatedStyles[property] = '';
  });

  // Применяем новые стили
  Object.entries(copiedStyles).forEach(([property, value]) => {
    // @ts-ignore
    updatedStyles[property] = value;
  });

  return updatedStyles
}
