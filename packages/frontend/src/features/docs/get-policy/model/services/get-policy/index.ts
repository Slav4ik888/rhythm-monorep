import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';



export interface ResGetPolicy {
  policy: string
}


export const getPolicy = createAsyncThunk<
  string,    // Res
  undefined, // Req
  ThunkConfig<Errors>
>(
  'features/docs/getPolicy',
  async (_, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
      const { data: { policy } } = await extra.api.get<ResGetPolicy>(API_PATHS.docs.getPolicy);

      return policy;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/docs/getPolicy' });
    }
  }
);
