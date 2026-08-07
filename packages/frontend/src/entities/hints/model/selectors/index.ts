/* eslint-disable */
import { StateSchema } from 'app/providers/store';
import { StateSchemaHints} from '../slice/state-schema';
import { createSelector } from '@reduxjs/toolkit';



const selectModule          = createSelector([(state: StateSchema) => state.hints || {} as StateSchemaHints], (state: StateSchemaHints) => state);

// export const selectLoading    = createSelector(selectModule, (state: StateSchemaHints) => state.loading);
// export const selectErrors     = createSelector(selectModule, (state: StateSchemaHints) => state.errors);
export const selectHintsQueue    = createSelector(selectModule, (state: StateSchemaHints) => state.hintsQueue);
export const selectСurrentHintId = createSelector(selectModule, (state: StateSchemaHints) => state.currentHintId);
export const selectShownHints    = createSelector(selectModule, (state: StateSchemaHints) => state.shownHints);
