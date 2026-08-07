/* eslint-disable */
import { StateSchema } from 'app/providers/store';
import { DashboardTemplatesEntities, StateSchemaDashboardTemplates } from '../slice/state-schema';
import { createSelector } from '@reduxjs/toolkit';
import { findTemplateBySelectedId, findViewItemById } from '../utils';
import { Template } from '../types';
import { ViewItem } from 'entities/dashboard-view';
import { isChanges } from 'shared/helpers/objects';



export const selectModule = createSelector([(state: StateSchema) => state.dashboardTemplates || {} as StateSchemaDashboardTemplates],
  (state: StateSchemaDashboardTemplates) => state);

export const selectLoading          = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.loading);
export const selectErrors           = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.errors);
export const selectIsMounted        = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state._isMounted);
export const selectBunchesUpdated   = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.bunchesUpdated);

export const selectEntities         = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.entities || {});
export const selectTemplates        = createSelector(selectEntities, (entities: DashboardTemplatesEntities) => Object.values(entities) || []);

export const selectOpened           = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.opened);
export const selectSelectedId       = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.selectedId);
export const selectStoredSelected   = createSelector(selectModule, (state: StateSchemaDashboardTemplates) => state.storedSelected);

export const selectSelectedViewItem = createSelector(
  selectEntities,
  selectSelectedId,
  (entities: DashboardTemplatesEntities, selectedId: string | undefined) => findViewItemById(
    entities, selectedId
  )
);

export const selectSelectedTemplate = createSelector(
  selectEntities,
  selectSelectedId,
  (entities: DashboardTemplatesEntities, selectedId: string | undefined) => findTemplateBySelectedId(
    entities, selectedId
  )
);


export const selectIsMainItem = createSelector(
  selectSelectedTemplate as unknown as (state: unknown) => Template | undefined,
  selectSelectedViewItem as unknown as (state: unknown) => ViewItem | undefined,
  (template: Template | undefined, selected: ViewItem | undefined): boolean => {
    if (! template || ! selected) return false;
    return selected.parentId === template.id;
  }
);

export const selectViewItems = createSelector(
  selectEntities,
  (entities: DashboardTemplatesEntities) => Object.values(entities)
);

// export const selectChangedTemplate = createSelector(
//   selectEntities,
//   selectStoredSelected,
//   (entities: DashboardTemplatesEntities, storedSelected: Template | undefined) => {
//     return getChanges(storedSelected, entities[storedSelected?.id || ''])
//   }
// );

export const selectIsUnsaved = createSelector(
  selectEntities,
  selectStoredSelected,
  (entities: DashboardTemplatesEntities, storedSelected: Template | undefined) => {
    return isChanges(storedSelected, entities[storedSelected?.id || ''])
  },
);
