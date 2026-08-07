import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { Template, PartialTemplate } from 'entities/dashboard-templates';
import { API_PATHS } from '../../../api-paths';
import { BunchAction } from 'shared/lib/structures/bunch';
import { Errors } from 'shared/lib/validators';



export interface PartialTemplateUpdate extends PartialTemplate {
  bunchId: string
}

/** v.2025-07-01 */
export interface UpdateTemplate {
  bunchUpdatedMs : number
  template       : Template | PartialTemplate // Add | Update
  bunchAction    : BunchAction
  // 1) Если нужно перезаписать весь template (например есть удалённые поля,
  // тогда в ДБ их надо обновлять без функции convertToDot)
  // 2) Если надо обновить storedSelected, чтобы исчезла надпись про unsaved
  fullSet?       : boolean
}


/** v.2025-06-28 */
export const updateTemplate = createAsyncThunk<
  UpdateTemplate,
  UpdateTemplate,
  ThunkConfig<Errors>
>(
  'features/dashboardTemplates/updateTemplate',
  async (updateData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.post<UpdateTemplate>(
        API_PATHS.templates.update,
        updateData
      );

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: `Error in features/dashboardTemplates/updateTemplate/${updateData.template.id}`
      });
    }
  }
);
