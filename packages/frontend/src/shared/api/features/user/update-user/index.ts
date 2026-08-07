import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { actionsUI } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { actionsUser, PartialUser } from 'entities/user';
import { userApi } from '../api';



/**
 * Owner update User data
 */
export const updateUser = createAsyncThunk<
  undefined,
  PartialUser,
  ThunkConfig<Errors>
>(
  'features/user/update',
  async (userData, thunkApi) => {
    const { extra: { api }, dispatch, rejectWithValue } = thunkApi;

    try {
      await userApi.update(api, userData);

      dispatch(actionsUser.updateUser(userData));
      dispatch(actionsUI.setSuccessMessage('Сохранено'));
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/user/update' });
    }
  }
);
