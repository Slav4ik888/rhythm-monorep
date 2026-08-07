import { StateSchema } from 'app/providers/store';
import { StateSchemaLoginPage } from '..';

export const selectModule  = (state: StateSchema) => state.loginPage || {} as StateSchemaLoginPage;
export const selectLoading = (state: StateSchema) => selectModule(state).loading;
export const selectErrors  = (state: StateSchema) => selectModule(state).errors;
export const selectResetEmailResult = (state: StateSchema) => selectModule(state).resetEmailResult;
