import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { API_PATHS } from 'shared/api';
import { BunchesUpdated } from 'shared/lib/structures/bunch';
import { Errors } from 'shared/lib/validators';
import { Template } from '../../types';



/** 2025-06-30 */
export type ResGetTemplates = {
  templates      : Template[]
  bunchesUpdated : BunchesUpdated
}


export interface ReqGetTemplates {
  bunchIds: string[] // То что надо загрузить
}


export const getTemplates = createAsyncThunk<
  ResGetTemplates,
  ReqGetTemplates,
  ThunkConfig<Errors>
>(
  'entities/dashboardTemplates/getTemplates',
  async (bunchData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.post<ResGetTemplates>(API_PATHS.templates.getTemplates, bunchData);

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in entities/dashboardTemplates/getTemplates'
      });
    }
  }
);
