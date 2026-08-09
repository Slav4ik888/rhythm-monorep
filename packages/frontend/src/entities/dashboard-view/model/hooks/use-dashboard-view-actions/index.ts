// packages/frontend/src/entities/dashboard-view/model/hooks/use-dashboard-view-actions/index.ts
// Zustand-версия хука (заменяет Redux dispatch)
// Публичный интерфейс сохранён для обратной совместимости

import { useMemo } from 'react';
import { useDashboardViewStore } from '../../store';
import type {
  ActivatedCopied,
  StateSchemaDashboardView,
  SetDashboardViewItems,
  SetEditMode,
  ChangeOneChartsItem,
  ChangeOneDatasetsItem,
  ChangeOneSettingsField,
  ChangeSelectedStyle,
  SetDashboardBunchesFromCache,
} from '../../state-schema';
import type { Errors } from 'shared/lib/validators';
import type { PartialViewItem, ViewItemId, ViewItemStyles } from '../../../types';
import { useDashboardViewState } from '../use-dashboard-view-state';

interface Config {
  parentId?: ViewItemId;
}

export const useDashboardViewActions = (config: Config = {}) => {
  const { parentId } = config;
  const state = useDashboardViewState({ parentId });

  const api = useMemo(
    () => ({
      // Методы работы с состоянием (через Zustand getState())
      setErrors: (errors: Errors) => useDashboardViewStore.getState().setErrors(errors),
      clearErrors: () => useDashboardViewStore.getState().clearErrors(),
      setInitial: (payload: StateSchemaDashboardView) => useDashboardViewStore.getState().setInitial(payload),
      setIsMounted: () => useDashboardViewStore.getState().setIsMounted(),
      setDashboardViewItems: (data: SetDashboardViewItems) =>
        useDashboardViewStore.getState().setDashboardViewItems(data),
      setEditMode: (data: SetEditMode) => useDashboardViewStore.getState().setEditMode(data),
      updateViewItems: (data: PartialViewItem[]) => useDashboardViewStore.getState().updateViewItems(data),
      cancelUpdateViewItem: () => useDashboardViewStore.getState().cancelUpdateViewItem(),

      // Movement
      setActiveMovementId: () => useDashboardViewStore.getState().setActiveMovementId(),
      clearActivatedMovementId: () => useDashboardViewStore.getState().clearActivatedMovementId(),

      // Copying
      setActiveCopied: (data: ActivatedCopied) => useDashboardViewStore.getState().setActiveCopied(data),
      clearActivatedCopied: () => useDashboardViewStore.getState().clearActivatedCopied(),

      // View
      setNewSelectedId: (id: ViewItemId) => useDashboardViewStore.getState().setNewSelectedId(id),
      setSelectedId: (id: ViewItemId) => useDashboardViewStore.getState().setSelectedId(id),
      setBright: (status: boolean) => useDashboardViewStore.getState().setBright(status),

      setIsUnsaved: (status: boolean) => useDashboardViewStore.getState().setIsUnsaved(status),

      // Styles
      changeOneStyleField: (data: ChangeSelectedStyle) => useDashboardViewStore.getState().changeOneStyleField(data),
      setSelectedStyles: (data: ViewItemStyles) => useDashboardViewStore.getState().setSelectedStyles(data),

      // Settings
      changeOneSettingsField: (data: ChangeOneSettingsField) =>
        useDashboardViewStore.getState().changeOneSettingsField(data),
      changeOneChartsItem: (data: ChangeOneChartsItem) => useDashboardViewStore.getState().changeOneChartsItem(data),
      changeOneDatasetsItem: (data: ChangeOneDatasetsItem) =>
        useDashboardViewStore.getState().changeOneDatasetsItem(data),

      // Bunches from cache
      setDashboardBunchesFromCache: (data: SetDashboardBunchesFromCache) =>
        useDashboardViewStore.getState().setDashboardBunchesFromCache(data),
    }),
    [],
  );

  return {
    ...state,
    ...api,
  };
};
