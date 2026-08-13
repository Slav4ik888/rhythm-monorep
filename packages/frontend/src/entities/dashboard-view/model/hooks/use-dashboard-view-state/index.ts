// packages/frontend/src/entities/dashboard-view/model/hooks/use-dashboard-view-state/index.ts
// Zustand-версия хука (заменяет Redux useSelector)
// Публичный интерфейс сохранён для обратной совместимости

import { useDashboardViewStore } from '../../store';
import type { ViewItem, ViewItemId } from '../../../types';
import { getChildren, getKod, getParents, getFirstItemInBranchWithGlobalKod } from '../../utils';
import type { ParentsViewItems } from '../../utils';
import { getChanges } from 'shared/helpers/objects';

interface Config {
  parentId?: ViewItemId;
}

export const useDashboardViewState = (config: Config = {}) => {
  const { parentId } = config;

  // Селекторы через Zustand
  const loading = useDashboardViewStore((state) => state.loading);
  const errors = useDashboardViewStore((state) => state.errors);
  const isMounted = useDashboardViewStore((state) => state._isMounted);
  const isLoaded = useDashboardViewStore((state) => state._isLoaded);

  const editMode = useDashboardViewStore((state) => state.editMode);
  const entities = useDashboardViewStore((state) => state.entities);
  const activatedMovementId = useDashboardViewStore((state) => state.activatedMovementId);
  const activatedCopied = useDashboardViewStore((state) => state.activatedCopied);
  const newSelectedId = useDashboardViewStore((state) => state.newSelectedId);
  const selectedId = useDashboardViewStore((state) => state.selectedId);
  const bright = useDashboardViewStore((state) => state.bright);
  const isUnsaved = useDashboardViewStore((state) => state.isUnsaved);
  const newStoredViewItem = useDashboardViewStore((state) => state.newStoredViewItem);
  const prevStoredViewItem = useDashboardViewStore((state) => state.prevStoredViewItem);

  // Производные селекторы (вычисляемые через get)
  const viewItems = Object.values(entities);
  const selectedItem = entities[selectedId] || {};

  // ParentsViewItems
  // Всегда объект (даже пустой {} для пустого дашборда), а не undefined:
  // DashboardRender обращается к parents[parentId], и undefined вызывает краш.
  const parentsViewItems: ParentsViewItems = getParents(viewItems);

  // Children
  const effectiveParentId = parentId || selectedId;
  const childrenViewItems = getChildren(viewItems, effectiveParentId as ViewItemId) as ViewItem[];
  const parentChildrenIds = childrenViewItems.map((item) => item.id);

  // Changes
  const changedViewItem = (() => {
    if (newStoredViewItem && selectedItem) {
      return getChanges(newStoredViewItem, entities?.[selectedId]);
    }
    return undefined;
  })();

  // Kod
  const fromGlobalKod = entities[selectedId] ? getKod(entities, entities[selectedId]) : '';
  const globalKodParent = entities[selectedId]?.id
    ? getFirstItemInBranchWithGlobalKod(entities, entities[selectedId]?.id)
    : '';

  return {
    loading,
    errors,
    isMounted,
    isLoaded,

    editMode,
    entities,
    viewItems,
    parentsViewItems,
    parentChildrenIds,

    // View
    newSelectedId,
    selectedId,
    selectedItem,
    bright,
    fromGlobalKod,
    globalKodParent,

    newStoredViewItem,
    prevStoredViewItem,
    childrenViewItems,

    // Changes
    isUnsaved,
    changedViewItem,

    // Movement
    activatedMovementId,

    // Copying
    activatedCopied,
  };
};
