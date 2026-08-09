// packages/frontend/src/pages/signup/model/services/signup-by-email-end/index.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { useUserStore, User } from 'entities/user';
import { actionsCompany, Company } from 'entities/company';
import type { SignupDataEnd } from '../../types';
import { useUIStore } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';
import { LS } from 'shared/lib/local-storage';
import { __devLog } from 'shared/lib/tests/__dev-log';

interface ResSignup {
  newUserData: User;
  newCompanyData: Company;
  message: string;
}

export const signupByEmailEnd = createAsyncThunk<undefined, SignupDataEnd, ThunkConfig<Errors>>(
  'pages/signup/signupByEmailEnd',
  // eslint-disable-next-line consistent-return
  async (signupDataEnd, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const {
        data: { newUserData, newCompanyData, message },
      } = await extra.api.post<ResSignup>(API_PATHS.auth.signup.byEmailEnd, { signupDataEnd });

      __devLog('signupByEmailEnd', 'data: ', newUserData, newCompanyData, message);
      const companyId = newCompanyData?.id || LS.getLastCompanyId();

      if (!companyId) return undefined;

      useUserStore.getState().setUser(companyId, newUserData);
      dispatch(actionsCompany.setCompany({ company: newCompanyData }));
      useUIStore.getState().setSuccessMessage(message);
    } catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      // eslint-disable-next-line consistent-return
      return rejectWithValue(
        (e as CustomAxiosError)?.response?.data || {
          general: 'Error in pages/signup/signupByEmailEnd',
        },
      );
    }
  },
);
