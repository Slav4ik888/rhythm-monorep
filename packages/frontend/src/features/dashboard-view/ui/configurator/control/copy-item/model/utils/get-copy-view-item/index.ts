import { ActivatedCopied, ViewItem, ViewItemId } from 'entities/dashboard-view';
import { createNextOrder, getChildren } from 'entities/dashboard-view/model/utils';
import { cloneObj } from 'shared/helpers/objects';
import { getNestedViewItems } from '../get-nested-view-items';
import { v4 as uuidv4 } from 'uuid';
import { creatorFixDate } from 'entities/base';



/** Coping first item or all nested items */
export const getCopyViewItem = (
  copiedItem  : ActivatedCopied, // Копируемый элемент
  newParentId : ViewItemId,      // Куда вставляется, будет parentId для первого элемента
  viewItems   : ViewItem[],
  userId      : string
): ViewItem[] => {
  const copyViewItem: ViewItem[] = [];

  // Copying item
  const copyingItem = viewItems?.find(it => it.id === copiedItem?.id) || {} as ViewItem;

  // Copying first item or all nested items
  const isAll = copiedItem?.type === 'copyItemsAll';
  const copyNestedItems = cloneObj(isAll ? getNestedViewItems(viewItems, copiedItem?.id) : [copyingItem]);

  // Create new ids & set its as parentId for all nested items
  const setNewIds = (
    currentItemId : ViewItemId,
    parentId      : ViewItemId,
    isFirst       : boolean = false
  ) => {
    const currentItem = copyNestedItems.find(item => item.id === currentItemId);

    if (currentItem) {
      currentItem.id         = uuidv4();
      currentItem.parentId   = parentId;
      currentItem.createdAt  = creatorFixDate(userId);
      currentItem.lastChange = creatorFixDate(userId);

      if (isFirst) { // Первый элемент помещаем в конец newParentId
        currentItem.order = createNextOrder(getChildren(viewItems, parentId));
      }
      copyViewItem.push(currentItem);

      getChildren(viewItems, currentItemId).forEach(item => setNewIds(item.id, currentItem.id));
    }
  };

  setNewIds(copiedItem?.id, newParentId, true);

  return copyViewItem
}
