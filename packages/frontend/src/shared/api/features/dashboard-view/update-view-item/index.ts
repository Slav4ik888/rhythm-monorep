import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';
import { PartialViewItem, ViewItem } from 'entities/dashboard-view';



export interface PartialViewItemUpdate extends PartialViewItem {
  bunchId: string
}

export interface UpdateViewItems {
  bunchUpdatedMs     : number
  companyId          : string
  viewItems          : PartialViewItemUpdate[]
  newStoredViewItem? : ViewItem | undefined // для сохранения из UnsavedChanges чтобы сохранился текущий элемент
  // name               : string // for dev - the name of the component calling this function
}

/**
 * Обновляем изменившиеся поля у группы элементов,
 */
export const updateViewItems = createAsyncThunk<
  UpdateViewItems,
  UpdateViewItems,
  ThunkConfig<Errors>
>(
  'features/dashboardView/updateViewItems',
  async (dataUpdate, thunkApi) => {
    const { dispatch, rejectWithValue, extra } = thunkApi;

    try {
      const { data } = await extra.api.patch<UpdateViewItems>(API_PATHS.dashboard.view.update, dataUpdate);

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/dashboardView/updateViewItems'
      });
    }
  }
);
