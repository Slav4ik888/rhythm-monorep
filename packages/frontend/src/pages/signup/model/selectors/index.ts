import { StateSchema } from 'app/providers/store';
import { StateSchemaSignupPage } from '..';

export const selectModule      = (state: StateSchema) => state.signupPage || {} as StateSchemaSignupPage;
export const selectLoading     = (state: StateSchema) => selectModule(state).loading;
export const selectErrors      = (state: StateSchema) => selectModule(state).errors;
export const selectSignupData  = (state: StateSchema) => selectModule(state).signupData;
export const selectCodeSended  = (state: StateSchema) => selectModule(state).codeSended;
