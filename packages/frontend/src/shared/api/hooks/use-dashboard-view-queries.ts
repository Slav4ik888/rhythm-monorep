// packages/frontend/src/shared/api/hooks/use-dashboard-view-queries.ts
// TanStack Query-хуки для работы с view-элементами дашборда
// Заменяет ручные API-вызовы в Zustand-сторе dashboard-view

import { useQuery, useMutation } from '@tanstack/react-query';
import { useDashboardViewStore } from 'entities/dashboard-view';
import { LS } from 'shared/lib/local-storage';
import { getPayloadError as getError } from 'shared/lib/errors';
import { updateEntities } from 'entities/base';
import { api, API_PATHS } from 'shared/api';
import cfg from 'app/config';
import { queryKeys } from '../query-keys';
import { getViewitemsFromBunches } from 'entities/dashboard-view/model/utils/get-viewitems-from-bunches';
import { getBunchesFromViewItems } from 'entities/dashboard-view/model/utils/get-bunches-from-viewitems';
import { getBunchesTimestamps } from 'entities/dashboard-view/model/utils/get-bunches-timestamps';
import { updateBunches } from 'entities/dashboard-view/model/utils/update-bunches';
import type { BunchesViewItem, ViewItem } from 'entities/dashboard-view/types/view-item';
import type { CreateGroupViewItems, UpdateViewItems, DeleteViews } from '../features/dashboard-view';

/** Аргументы для получения bunches */
export interface GetBunchesArgs {
  companyId: string;
  bunchIds: string[];
  bunchesUpdated?: Record<string, number>;
  dashboardSheetId?: string;
  /** Отключить автоматическую загрузку (для TanStack Query enabled) */
  enabled?: boolean;
}

/**
 * Хук для получения bunches дашборда.
 * Автоматически обновляет Zustand-стор dashboard-view при успешном ответе.
 */
export const useGetBunchesQuery = ({ companyId, bunchIds, bunchesUpdated, enabled: queryEnabled }: GetBunchesArgs) => {
  const store = useDashboardViewStore;

  return useQuery({
    queryKey: queryKeys.dashboard.bunches(companyId, bunchIds),
    queryFn: async ({ signal }): Promise<BunchesViewItem> => {
      store.setState({ loading: true, errors: {} });

      let bunches: BunchesViewItem;
      let compId: string;

      if (cfg.IS_DEV) {
        compId = LS.getLastCompanyId() || '';
        bunches = LS.getBunches(compId);
      } else {
        const { data } = await api.post(API_PATHS.dashboard.bunch.get, { companyId, bunchIds }, { signal });
        // Бэкенд отдаёт `{ bunches: BunchesViewItem }` (ResGetBunches), а не сам объект bunches.
        // Берём именно поле bunches — иначе viewItems распакуются некорректно и дашборд останется пустым.
        bunches = (data as { bunches?: BunchesViewItem })?.bunches || {};
        compId = companyId;
      }

      LS.setBunches(compId, { ...LS.getBunches(compId), ...bunches });
      if (bunchesUpdated) {
        LS.setViewBunchesUpdated(compId, { ...LS.getViewBunchesUpdated(compId), ...bunchesUpdated });
      }

      const state = store.getState();
      store.setState({
        entities: updateEntities(state.entities, getViewitemsFromBunches(bunches)),
        _isLoaded: true,
        activatedMovementId: '',
        activatedCopied: undefined,
        bright: false,
        isUnsaved: false,
        loading: false,
        errors: {},
      });

      return bunches;
    },
    enabled: queryEnabled ?? (!!companyId && bunchIds.length > 0),
    staleTime: 30 * 1000,
  });
};

/**
 * Хук для создания группы view-элементов.
 */
export const useCreateGroupViewItemsMutation = () => {
  const store = useDashboardViewStore;

  return useMutation({
    mutationFn: async (payload: CreateGroupViewItems): Promise<void> => {
      store.setState({ loading: true, errors: {} });
      await api.post(API_PATHS.dashboard.view.createGroupItems, payload as any);
      store.setState({ loading: false });
    },
    onError: (e: any) => {
      store.setState({
        errors: getError(e?.response?.data || { general: 'Error in createGroupViewItems' }),
        loading: false,
      });
    },
  });
};

/**
 * Хук для сохранения изменений view-элементов.
 * После успешного сохранения обновляет entities и LS.
 */
export const useUpdateViewItemsMutation = () => {
  const store = useDashboardViewStore;

  return useMutation({
    mutationFn: async (payload: UpdateViewItems): Promise<void> => {
      store.setState({ loading: true, errors: {} });
      await api.patch(API_PATHS.dashboard.view.update, payload);
    },
    onSuccess: (_data, variables) => {
      const { viewItems, companyId, bunchUpdatedMs } = variables;
      const currentState = store.getState();

      LS.setBunches(
        companyId,
        updateBunches(LS.getBunches(companyId), getBunchesFromViewItems(viewItems as ViewItem[])),
      );
      LS.setViewBunchesUpdated(companyId, {
        ...LS.getViewBunchesUpdated(companyId),
        ...getBunchesTimestamps((viewItems || []) as ViewItem[], bunchUpdatedMs || 0),
      });

      store.setState({
        entities: updateEntities(currentState.entities, viewItems),
        activatedMovementId: '',
        activatedCopied: undefined,
        bright: false,
        isUnsaved: false,
        loading: false,
        errors: {},
      });
    },
    onError: (e: any) => {
      store.setState({
        prevStoredViewItem: store.getState().newStoredViewItem,
        newStoredViewItem: undefined,
        errors: getError(e?.response?.data || { general: 'Error in saveUpdateViewItems' }),
        loading: false,
      });
    },
  });
};

/**
 * Хук для удаления view-элементов.
 */
export const useDeleteViewItemMutation = () => {
  const store = useDashboardViewStore;

  return useMutation({
    mutationFn: async (payload: DeleteViews): Promise<void> => {
      store.setState({ loading: true, errors: {} });
      await api.post(API_PATHS.dashboard.view.delete, payload);
    },
    onSuccess: (_data, variables) => {
      const { companyId, viewItems, bunchUpdatedMs } = variables;
      const currentState = store.getState();

      const newEntities = { ...currentState.entities };
      viewItems?.forEach((item: any) => delete newEntities[item.id]);

      LS.setBunches(companyId, getBunchesFromViewItems(Object.values(newEntities)));
      LS.setViewBunchesUpdated(companyId, {
        ...LS.getViewBunchesUpdated(companyId),
        ...getBunchesTimestamps((viewItems || []) as any[], bunchUpdatedMs || 0),
      });

      store.setState({
        entities: newEntities,
        selectedId: '',
        newStoredViewItem: undefined,
        prevStoredViewItem: undefined,
        activatedMovementId: '',
        activatedCopied: undefined,
        bright: false,
        isUnsaved: false,
        loading: false,
        errors: {},
      });
    },
    onError: (e: any) => {
      store.setState({
        prevStoredViewItem: store.getState().newStoredViewItem,
        errors: getError(e?.response?.data || { general: 'Error in saveDeleteViewItem' }),
        loading: false,
      });
    },
  });
};
