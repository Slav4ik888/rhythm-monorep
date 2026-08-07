import { ViewItem, ViewItemId } from '../../../types';


/**
 * Returns children by parentId (только первого уровня, без вложений)
 */
export const getChildren = (items: ViewItem[], parentId: ViewItemId | undefined): ViewItem[] => {
  if (! items || ! items.length) return [];

  return items.filter(item => item.parentId === parentId);
};
