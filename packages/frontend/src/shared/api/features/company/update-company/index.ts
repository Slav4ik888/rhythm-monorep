import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { actionsUI } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';
import { PartialCompany } from 'entities/company';



/**
 * Owner update Company data
 */
export const updateCompany = createAsyncThunk <
  PartialCompany,
  PartialCompany,
  ThunkConfig<Errors>
>(
  'features/company/update',
  async (companyData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.patch<PartialCompany>(API_PATHS.company.update, { companyData });

      dispatch(actionsUI.setSuccessMessage('Сохранено'));

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/company/update' });
    }
  }
);
