import { FC, memo, useCallback } from 'react';
import { ViewItem, useDashboardViewActions } from 'entities/dashboard-view';
import { Toward, TowardType } from 'shared/ui/configurators-components/toward';
import { calcNewOrder } from 'shared/lib/calc-new-order';
import { sortingArr } from 'shared/helpers/sorting';



interface Props {
  viewItem: ViewItem
}

/**
 * Перемещение (изменение order) внутри родителя
 */
export const MoveItemUpdownward: FC<Props> = memo(({ viewItem }) => {
  const { childrenViewItems, updateViewItems } = useDashboardViewActions({ parentId: viewItem.parentId });

  const handleClick = useCallback((type: TowardType) => {
    updateViewItems([{
      id    : viewItem.id,
      order : calcNewOrder(type, sortingArr(childrenViewItems, 'order'), viewItem)
    }]);
  }, [childrenViewItems, viewItem, updateViewItems]);

  return (
    <>
      <Toward type='up'   onClick={handleClick} />
      <Toward type='down' onClick={handleClick} />
    </>
  )
});
