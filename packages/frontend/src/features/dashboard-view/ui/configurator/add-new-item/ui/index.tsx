import { FC, memo, useCallback } from 'react';
import {
  createViewItem, createNextOrder, NO_SHEET_ID, ViewItemType, ViewItemId, MAX_COUNT_BUNCH_VIEWITEMS,
 } from 'entities/dashboard-view';
import { useUser } from 'entities/user';
import { useCompany } from 'entities/company';
import { findAvailableBunchId } from 'shared/lib/structures/bunch';
import { useDashboardViewServices } from '../../../../model/hooks';
import { usePages } from 'shared/lib/hooks';



interface Props {
  parentId  : ViewItemId
  component : FC<{ onClick: (type: ViewItemType | undefined) => void }> // Btn
}

/** Feature for add new ViewItem */
export const AddNewViewItem: FC<Props> = memo(({ component: Component, parentId }) => {
  const {
    selectedId, viewItems, childrenViewItems, serviceCreateGroupViewItems,
  } = useDashboardViewServices({ parentId });
  const { dashboardSheetId } = usePages();
  const { userId } = useUser();
  const { paramsCompanyId } = useCompany();


  const handleAdd = useCallback((type: ViewItemType | undefined) => {
    const availableBunchId = findAvailableBunchId(viewItems, MAX_COUNT_BUNCH_VIEWITEMS);
    const bunchAction = availableBunchId ? 'update' : 'create';

    const createViewItems = [createViewItem(
      userId,
      {
        sheetId  : dashboardSheetId || NO_SHEET_ID, // Тот sheet в котором находится пользователь
        bunchId  : availableBunchId,
        parentId : parentId || selectedId, // Если нажали из панели то создастся на 1м уровне
        order    : createNextOrder(childrenViewItems),
        type,
      }
    )];

    serviceCreateGroupViewItems({
      companyId      : paramsCompanyId,
      bunchUpdatedMs : Date.now(),
      viewItems      : createViewItems,
      bunchAction,
    });
  }, [
      selectedId, dashboardSheetId, parentId, viewItems, paramsCompanyId, userId, childrenViewItems,
      serviceCreateGroupViewItems
    ]
  );


  return (
    <Component onClick={handleAdd} />
  )
});
