import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { API_PATHS } from 'shared/api';
import { BunchesUpdated } from 'shared/lib/structures/bunch';
import { Errors } from 'shared/lib/validators';



/** Актуальное состояние bunchesUpdated from DB */
export const getBunchesUpdated = createAsyncThunk<
  BunchesUpdated,
  undefined,
  ThunkConfig<Errors>
>(
  'entities/dashboardTemplates/getBunchesUpdated',
  async (_, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.get<BunchesUpdated>(API_PATHS.templates.getBunchesUpdated);

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in entities/dashboardTemplates/getBunchesUpdated'
      });
    }
  }
);
