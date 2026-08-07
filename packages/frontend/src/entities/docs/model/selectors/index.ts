import { createSelector } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers/store';
import { DocKey, StateSchemaDocs } from '../slice';


export const selectModule = createSelector([(state: StateSchema) => state.docs || {} as StateSchemaDocs],
  (state: StateSchemaDocs) => state);
export const selectLoading = createSelector(selectModule, (state: StateSchemaDocs) => state.loading);
export const selectErrors  = createSelector(selectModule, (state: StateSchemaDocs) => state.errors);

export const selectDocs    = createSelector(selectModule, (state: StateSchemaDocs) => state.docKeys);
export const selectPolicy  = createSelector(selectModule, (state: StateSchemaDocs) => state.docKeys?.policy || '');
