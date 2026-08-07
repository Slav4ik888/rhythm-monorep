import { ViewItemId, ViewItem } from 'entities/dashboard-view';
import { getChildren } from 'entities/dashboard-view/model/utils';


/** Все вложенные элементы в выбранном элементе */
export const getNestedViewItems = (
  viewItems  : ViewItem[],
  selectedId : ViewItemId | undefined,
): ViewItem[] => {
  const items: ViewItem[] = [];
  const activeItem = viewItems?.find(item => item.id === selectedId);
  if (activeItem) items.push(activeItem);

  const getAllItems = (parentId: ViewItemId | undefined) => {
    getChildren(viewItems, parentId)?.forEach(item => {
      items.push(item);
      getAllItems(item.id);
    });
  };

  getAllItems(selectedId);

  return items
}
