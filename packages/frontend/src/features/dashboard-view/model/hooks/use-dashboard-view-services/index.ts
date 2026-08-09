// packages/frontend/src/features/dashboard-view/model/hooks/use-dashboard-view-services/index.ts

import { ViewItemId, useDashboardViewActions, ReqGetBunches } from 'entities/dashboard-view';
import { useMemo } from 'react';
import { useDashboardViewStore } from 'entities/dashboard-view/model/store';
import type { CreateGroupViewItems, UpdateViewItems, DeleteViews } from 'shared/api/features/dashboard-view';

interface Config {
  parentId?: ViewItemId;
}

export const useDashboardViewServices = (config: Config = {}) => {
  const { parentId } = config;

  const actions = useDashboardViewActions({ parentId });

  const api = useMemo(
    () => ({
      // Сервисные методы (features) — все через Zustand store, не через Redux dispatch
      serviceGetBunches: (data: ReqGetBunches) => useDashboardViewStore.getState().fetchBunches(data),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serviceCreateGroupViewItems: (data: CreateGroupViewItems) =>
        useDashboardViewStore.getState().createGroupViewItems(data as any),
      serviceUpdateViewItems: (data: UpdateViewItems) => useDashboardViewStore.getState().saveUpdateViewItems(data),
      serviceDeleteViews: (data: DeleteViews) => useDashboardViewStore.getState().saveDeleteViewItem(data),

      // Dev-методы
      dev: {},
    }),
    [],
  );

  return {
    ...actions,
    ...api,
  };
};
