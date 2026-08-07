import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { API_PATHS } from '../../../api-paths';
import { Errors } from 'shared/lib/validators';
import { ViewItemId } from 'entities/dashboard-view';



/** v.2025-07-01 */
export interface DeleteTemplate {
  bunchUpdatedMs : number
  templateId     : ViewItemId
  bunchId        : ViewItemId
}


/** v.2025-07-01 */
export const deleteTemplate = createAsyncThunk<
  DeleteTemplate,
  DeleteTemplate,
  ThunkConfig<Errors>
>(
  'features/dashboardTemplates/deleteTemplate',
  async (deleteData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.post<DeleteTemplate>(
        API_PATHS.templates.delete,
        deleteData
      );

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: `Error in features/dashboardTemplates/deleteTemplate/${deleteData.templateId}`
      });
    }
  }
);
