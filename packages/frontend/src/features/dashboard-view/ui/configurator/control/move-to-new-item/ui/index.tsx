import { FC, memo, useCallback } from 'react';
import { createViewItem, MAX_COUNT_BUNCH_VIEWITEMS, ORDER_STEP } from 'entities/dashboard-view';
import MoveIcon from '@mui/icons-material/MoveUp';
import { useUser } from 'entities/user';
import { useCompany } from 'entities/company';
import { updateObject } from 'shared/helpers/objects';
import { AddBtn } from 'shared/ui/configurators-components';
import { findAvailableBunchId } from 'shared/lib/structures/bunch';
import { useDashboardViewServices } from 'features/dashboard-view';



/**
 * Создать новый Box и переместить в него этот элемент
 */
export const MoveToNewItem: FC = memo(() => {
  const { selectedItem, viewItems, serviceCreateGroupViewItems, serviceUpdateViewItems } = useDashboardViewServices();
  const { userId } = useUser();
  const { paramsCompanyId } = useCompany();


  const handleClick = useCallback(() => {
    if (! selectedItem?.id) return;

    // New Box is creating
    const availableBunchId = findAvailableBunchId(viewItems, MAX_COUNT_BUNCH_VIEWITEMS);

    const newBoxItem = createViewItem(userId,
      {
        sheetId  : selectedItem.sheetId,
        bunchId  : availableBunchId,
        parentId : selectedItem.parentId,
        order    : selectedItem.order,
        type     : 'box',
      }
    );

    const bunchUpdatedMs = Date.now();
    serviceCreateGroupViewItems({
      companyId      : paramsCompanyId,
      viewItems      : [newBoxItem],
      bunchAction    : availableBunchId ? 'update' : 'create',
      bunchUpdatedMs,
    });

    // SelectedItem is moving to new Box
    const updatedItem = {
      id       : selectedItem.id,
      bunchId  : selectedItem.bunchId,
      parentId : newBoxItem.id,
      order    : ORDER_STEP
    };
    serviceUpdateViewItems({
      companyId         : paramsCompanyId,
      viewItems         : [updatedItem],
      newStoredViewItem : updateObject(selectedItem, updatedItem),
      bunchUpdatedMs,
    });
  }, [userId, paramsCompanyId, selectedItem, viewItems, serviceCreateGroupViewItems, serviceUpdateViewItems]);


  return (
    <AddBtn
      type      = 'box'
      toolTitle = 'Создать новый Box и переместить в него этот элемент'
      startIcon = {MoveIcon}
      onClick   = {handleClick}
    />
  )
});
