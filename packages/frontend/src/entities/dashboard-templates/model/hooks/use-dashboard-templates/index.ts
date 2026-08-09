// packages/frontend/src/entities/dashboard-templates/model/hooks/use-dashboard-templates/index.ts
// Хук useDashboardTemplates — мигрирован с Redux на Zustand
// Публичный интерфейс сохранён для обратной совместимости

import { useMemo } from 'react';
import {
  useDashboardTemplatesStore,
  selectLoading,
  selectErrors,
  selectIsMounted,
  selectBunchesUpdated,
  selectEntities,
  selectTemplates,
  selectOpened,
  selectSelectedId,
  selectSelectedTemplate,
  selectSelectedViewItem,
  selectIsMainItem,
  selectStoredSelected,
  selectIsUnsaved,
} from '../../store';
import { Errors } from 'shared/lib/validators';
import type { StateSchemaDashboardTemplates } from '../../slice/state-schema';
import { ViewItemId } from 'entities/dashboard-view';
import type { DeleteTemplate, UpdateTemplate } from 'shared/api/features/dashboard-templates';

export const useDashboardTemplates = () => {
  // Состояние через Zustand селекторы
  const loading = useDashboardTemplatesStore(selectLoading);
  const errors = useDashboardTemplatesStore(selectErrors);
  const isMounted = useDashboardTemplatesStore(selectIsMounted);
  const bunchesUpdated = useDashboardTemplatesStore(selectBunchesUpdated);
  const entities = useDashboardTemplatesStore(selectEntities);
  const rawTemplates = useDashboardTemplatesStore(selectTemplates); // entities (объект), стабильная ссылка
  // Преобразуем entities в массив через useMemo — чтобы не создавать новый массив на каждом рендере
  const templates = useMemo(() => Object.values(rawTemplates || {}), [rawTemplates]);
  const opened = useDashboardTemplatesStore(selectOpened);
  const selectedId = useDashboardTemplatesStore(selectSelectedId);
  const selectedTemplate = useDashboardTemplatesStore(selectSelectedTemplate);
  const selectedViewItem = useDashboardTemplatesStore(selectSelectedViewItem);
  const isMainItem = useDashboardTemplatesStore(selectIsMainItem);
  const storedSelected = useDashboardTemplatesStore(selectStoredSelected);
  const isUnsaved = useDashboardTemplatesStore(selectIsUnsaved);

  // Действия через getState() (как в useDashboardData)
  const api = useMemo(() => {
    const store = useDashboardTemplatesStore.getState;
    return {
      setErrors: (errors: Errors) => store().setErrors(errors),
      clearErrors: () => store().clearErrors(),

      setInitial: (state: StateSchemaDashboardTemplates) => store().setInitial(state),
      setIsMounted: () => store().setIsMounted(),
      setOpened: (flag: boolean) => store().setOpened(flag),
      setSelectedId: (id: ViewItemId) => store().setSelectedId(id),
      activateMainViewItem: () => store().activateMainViewItem(),
      deleteSelectedViewItem: () => store().deleteSelectedViewItem(),
      cancelUpdateTemplate: () => store().cancelUpdateTemplate(),

      serviceGetBunchesUpdated: () => store().serviceGetBunchesUpdated(),
      serviceGetTemplates: (data: { bunchIds: string[] }) => store().serviceGetTemplates(data),
      serviceUpdateTemplate: (data: UpdateTemplate) => store().serviceUpdateTemplate(data),
      serviceDeleteTemplate: (data: DeleteTemplate) => store().serviceDeleteTemplate(data),
    };
  }, []);

  return {
    loading,
    errors,
    isMounted,
    bunchesUpdated,

    entities,
    templates,

    opened,
    selectedId,
    storedSelected,
    selectedTemplate,
    selectedViewItem,
    isMainItem,
    isUnsaved,

    ...api,
  };
};
