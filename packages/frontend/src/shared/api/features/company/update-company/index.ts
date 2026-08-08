// packages/frontend/src/shared/api/features/company/update-company/index.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { useUIStore } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from '../../../api-paths';
import { PartialCompany } from 'entities/company';

/**
 * Owner update Company data
 */
export const updateCompany = createAsyncThunk<PartialCompany, PartialCompany, ThunkConfig<Errors>>(
  'features/company/update',
  async (companyData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      // PATCH не работает через Vite dev-прокси (известный баг), используем POST
      const { data } = await extra.api.post<PartialCompany>(API_PATHS.company.update, { companyData });

      useUIStore.getState().setSuccessMessage('Сохранено');

      return data;
    } catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/company/update' });
    }
  },
);
