import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { actionsUI } from 'entities/ui';
import { Errors } from 'shared/lib/validators';
import { getEntities } from './utils';
import { LS } from 'shared/lib/local-storage';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { API_PATHS } from 'shared/api';
import { ResGetGoogleData, ReqGetGoogleData } from 'shared/types';



export const getData = createAsyncThunk<
  ResGetGoogleData,
  ReqGetGoogleData,
  ThunkConfig<Errors>
>(
  'features/dashboard/getData',
  async ({ companyId, dashboardSheetId }, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      const { data } = await extra.api.post(API_PATHS.google.getData, { companyId, dashboardSheetId });

      // **
      // For development - сохраняем входящие данные в localStorage
      __devLog('getData', 'GS data: ', data);
      LS.devSetGSData(companyId, data);

      const gsData = getEntities(data);
      __devLog('getData', 'gsData: ', gsData);
      dispatch(actionsUI.setSuccessMessage('Данные с гугл-таблицы загружены'));
      dispatch(actionsUI.setPageLoading({ 'get-g-data': { text: '', name: 'getData' } }));

      return {
        companyId,
        data: gsData
      };
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/dashboard/getData'
      });
    }
  }
);
