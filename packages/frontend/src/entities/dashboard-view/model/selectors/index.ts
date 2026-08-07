/* eslint-disable */
import { StateSchema } from 'app/providers/store';
import { ViewItem, ViewItemId } from '../../types';
import { DashboardViewEntities, StateSchemaDashboardView } from '../slice/state-schema';
import { getChildren, getKod, getParents, getFirstItemInBranchWithGlobalKod } from '../utils';
import { createSelector } from '@reduxjs/toolkit';
import { getChanges } from 'shared/helpers/objects';



export const selectModule       = createSelector([(state: StateSchema) => state.dashboardView || {} as StateSchemaDashboardView], (state: StateSchemaDashboardView) => state);

export const selectLoading      = createSelector(selectModule, (state: StateSchemaDashboardView) => state.loading);
export const selectErrors       = createSelector(selectModule, (state: StateSchemaDashboardView) => state.errors);
export const selectIsMounted    = createSelector(selectModule, (state: StateSchemaDashboardView) => state._isMounted);
export const selectIsLoaded     = createSelector(selectModule, (state: StateSchemaDashboardView) => state._isLoaded);

export const selectEditMode     = createSelector(selectModule, (state: StateSchemaDashboardView) => state.editMode);
export const selectEntities     = createSelector(selectModule, (state: StateSchemaDashboardView) => state.entities || {});

export const selectNewSelectedId = createSelector(selectModule, (state: StateSchemaDashboardView) => state.newSelectedId);

export const selectSelectedId   = createSelector(selectModule, (state: StateSchemaDashboardView) => state.selectedId);
export const selectSelectedItem = createSelector(selectEntities, selectSelectedId, (entities: DashboardViewEntities, selectedId: string) => entities[selectedId] || {});

export const selectBright             = createSelector(selectModule, (state: StateSchemaDashboardView) => state.bright);
export const selectIsUnsaved          = createSelector(selectModule, (state: StateSchemaDashboardView) => state.isUnsaved);
export const selectNewStoredViewItem  = createSelector(selectModule, (state: StateSchemaDashboardView) => state.newStoredViewItem);
export const selectPrevStoredViewItem = createSelector(selectModule, (state: StateSchemaDashboardView) => state.prevStoredViewItem);

export const selectViewItems = createSelector(selectEntities,
  (entities: DashboardViewEntities) => Object.values(entities));

/** Returns object ParentsViewItems { [parentId: string]: ViewItem[] } */
export const selectParentsViewItems = createSelector(selectViewItems, (items: ViewItem[]) => getParents(items));

/** Parent`s children by parentId  */
export const makeSelectChildrenViewItems = (parentId?: ViewItemId) => createSelector(
  [selectViewItems, selectSelectedId],
  (items: ViewItem[], selectedId: string) => getChildren(items, parentId || selectedId)
);

export const selectViewItemById = createSelector(selectEntities, selectSelectedId, (entities: DashboardViewEntities, selectedId: string) => entities[selectedId] || {});

// Возвращает объект с изменившимися полями
export const selectChangedViewItem = createSelector(
  selectModule,
  selectEntities,
  (state: StateSchemaDashboardView, entities: DashboardViewEntities) =>
    getChanges(state.newStoredViewItem, entities?.[state.selectedId])
);

export const selectFromGlobalKod = createSelector(selectEntities, selectSelectedId, (entities: DashboardViewEntities, selectedId: string) => getKod(entities, entities[selectedId]));

export const selectGlobalKodParent = createSelector(selectEntities, selectSelectedId, (entities: DashboardViewEntities, selectedId: string) => getFirstItemInBranchWithGlobalKod(entities, entities[selectedId]?.id));

// export const selectViewItemStyle = createSelector(selectEntities, selectSelectedId,
//   (entities: DashboardViewEntities, selectedId: string) => entities[selectedId]?.styles || {});

// export const makeSelectStyleByField = (field: ViewItemStylesField) => createSelector(
//   [selectEntities, selectSelectedId],
//   (entities: DashboardViewEntities, selectedId: string) =>
//     entities[selectedId]?.styles?.[field]
// );

export const selectActivatedMovementId = createSelector(selectModule, (state: StateSchemaDashboardView) => state.activatedMovementId);
export const selectActivatedCopied     = createSelector(selectModule, (state: StateSchemaDashboardView) => state.activatedCopied);
