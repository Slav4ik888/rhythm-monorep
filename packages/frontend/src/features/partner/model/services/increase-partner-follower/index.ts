import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';



export interface ReqData {
  partnerId: string
}


// interface ResData {
// }

/** Проверяет, авторизован ли пользователь, и если да, то возвращает данные пользователя. */
export const increasePartnerFollower = createAsyncThunk<
  undefined, // ResData
  ReqData,   // ReqData
  ThunkConfig<Errors>
>(
  'features/partner/increasePartnerFollower',
  async ({ partnerId }, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      await extra.api.post(API_PATHS.partner.increaseFollower, { partnerId });

      return undefined;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/partner/increasePartnerFollower'
      });
    }
  }
);
