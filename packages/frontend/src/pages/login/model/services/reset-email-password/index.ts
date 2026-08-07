import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { actionsUI } from 'entities/ui';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';


export interface ResResetEmailPassword {
  message: string
}


export const resetEmailPassword = createAsyncThunk<
  undefined,
  string,
  ThunkConfig<Errors>
>(
  'pages/login/resetEmailPassword',
  // eslint-disable-next-line consistent-return
  async (email, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
      const { data: { message } } = await extra.api.post<ResResetEmailPassword>(
        API_PATHS.auth.login.resetEmailPassword,
        { email }
      );

      dispatch(actionsUI.setSuccessMessage(message));
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      // eslint-disable-next-line consistent-return
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error pages/login/resetEmailPassword'
      });
    }
  }
);
