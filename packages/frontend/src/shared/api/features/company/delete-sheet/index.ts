import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';



export interface DeleteSheet {
  companyId : string
  sheetId   : string
}

/**
 * Delete one sheet by id
 */
export const deleteSheet = createAsyncThunk <
  DeleteSheet,
  DeleteSheet,
  ThunkConfig<Errors>
>(
  'features/company/deleteSheet',
  async (companyData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.patch<DeleteSheet>(API_PATHS.company.deleteSheet, companyData);

      return data;
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/company/deleteSheet' });
    }
  }
);
