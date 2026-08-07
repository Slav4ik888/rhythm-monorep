import { ViewItemId, useDashboardViewActions, getBunches, ReqGetBunches } from 'entities/dashboard-view';
import { useMemo } from 'react';
import {
  createGroupViewItems, CreateGroupViewItems, deleteViewItem, DeleteViews,
  UpdateViewItems, updateViewItems
} from 'shared/api/features/dashboard-view';
import { useAppDispatch } from 'shared/lib/hooks';



interface Config {
  parentId? : ViewItemId
}

export const useDashboardViewServices = (config: Config = {}) => {
  const { parentId } = config;
  const dispatch = useAppDispatch();

  const actions = useDashboardViewActions({ parentId });

  const api = useMemo(() => ({
    // Сервисные методы (features)
    // serviceGetViewItems         : (data: ReqGetViewItems) => dispatch(getViewItems(data)),
    serviceGetBunches           : (data: ReqGetBunches) => dispatch(getBunches(data)),
    serviceCreateGroupViewItems : (data: CreateGroupViewItems) => dispatch(createGroupViewItems(data)),
    serviceUpdateViewItems      : (data: UpdateViewItems) => dispatch(updateViewItems(data)),
    serviceDeleteViews          : (data: DeleteViews) => dispatch(deleteViewItem(data)),

    // Dev-методы
    dev: {
      // devSeriviceCreateBunches: (companyId: string) => dispatch(createBunches({ companyId })),
    }
  }),
    [dispatch]
  );


  return {
    ...actions,
    ...api
  }
};
