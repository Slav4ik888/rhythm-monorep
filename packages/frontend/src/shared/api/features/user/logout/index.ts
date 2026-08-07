import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { actionsCompany, Company } from 'entities/company';
import { Errors } from 'shared/lib/validators';
import { userApi } from '../api';
import { actionsUser } from 'entities/user';



/**
 * Logout User & set initial
 */
export const logout = createAsyncThunk <
  undefined,
  undefined,
  ThunkConfig<Errors>
>(
  'features/user/logout',
  // eslint-disable-next-line consistent-return
  (_, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      userApi.logout(extra.api);

      dispatch(actionsUser.clearUser());
      dispatch(actionsCompany.setCompany({ company: {} as Company }));
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/user/logout' });
    }
  }
);
