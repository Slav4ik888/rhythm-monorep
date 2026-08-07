import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { SignupData } from '../../types';
import { actionsUI } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';
import { __devLog } from 'shared/lib/tests/__dev-log';



interface ResSignupStart {
  message: string
}

export const signupByEmailStart = createAsyncThunk<
  SignupData,
  SignupData,
  ThunkConfig<Errors>
>(
  'pages/signup/byEmailStart',
  async (signupData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data: { message } } = await extra.api.post<ResSignupStart>(
        API_PATHS.auth.signup.byEmailStart,
        { signupData }
      );

      dispatch(actionsUI.setSuccessMessage(message));

      return signupData
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError)?.response?.data || {
        general: 'Error in pages/signup/byEmailStart'
      });
    }
  }
);
