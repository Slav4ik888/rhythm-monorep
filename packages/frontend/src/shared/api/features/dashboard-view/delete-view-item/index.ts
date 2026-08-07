import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';
import { PartialViewItemUpdate } from '../update-view-item';



export interface DeleteViews {
  bunchUpdatedMs : number
  companyId      : string
  viewItems      : PartialViewItemUpdate[] // Ids удаляемого и всех вложенных элементов
}

/** Удаляем выбранный элемент */
export const deleteViewItem = createAsyncThunk<
  DeleteViews,
  DeleteViews,
  ThunkConfig<Errors>
>(
  'features/dashboardView/deleteViewItem',
  async (data, thunkApi) => {
    const { dispatch, rejectWithValue, extra } = thunkApi;

    try {
      await extra.api.post(API_PATHS.dashboard.view.delete, data);

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/dashboardView/deleteViewItem'
      });
    }
  }
);
