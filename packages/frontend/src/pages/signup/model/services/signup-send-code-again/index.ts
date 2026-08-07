import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { SignupData } from '../../types';
import { actionsUI } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';



interface ResSendCodeAgain {
  message: string
}

export const signupSendCodeAgain = createAsyncThunk<
  boolean,
  SignupData,
  ThunkConfig<Errors>
>(
  'pages/signup/sendCodeAgain',
  async (signupData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data: { message } } = await extra.api.post<ResSendCodeAgain>(
        API_PATHS.auth.signup.sendCodeAgain,
        { signupData }
      );

      dispatch(actionsUI.setSuccessMessage(message));

      return true
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError)?.response?.data || {
        general: 'Error in pages/signup/sendCodeAgain'
      });
    }
  }
);
