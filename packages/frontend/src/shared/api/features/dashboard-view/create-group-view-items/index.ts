import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';
import { ViewItem } from 'entities/dashboard-view';
import { BunchAction } from 'shared/lib/structures/bunch';



export interface CreateGroupViewItems {
  bunchUpdatedMs : number
  companyId      : string
  viewItems      : ViewItem[]
  bunchAction    : BunchAction
}

export const createGroupViewItems = createAsyncThunk<
  CreateGroupViewItems,
  CreateGroupViewItems,
  ThunkConfig<Errors>
>(
  'features/dashboardView/createGroupViewItems',
  async (dataCreated, thunkApi) => {
    const { dispatch, rejectWithValue, extra } = thunkApi;

    try {
      const { data } = await extra.api.post<CreateGroupViewItems>(
        API_PATHS.dashboard.view.createGroupItems,
        dataCreated
      );

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/dashboardView/createGroupViewItems'
      });
    }
  }
);
