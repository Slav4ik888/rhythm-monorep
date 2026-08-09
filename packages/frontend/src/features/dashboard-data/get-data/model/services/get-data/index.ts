// packages/frontend/src/features/dashboard-data/get-data/model/services/get-data/index.ts
// Переписано с createAsyncThunk на прямую async-функцию (миграция Redux → Zustand)

import { useUIStore } from 'entities/ui';
import { useDashboardDataStore } from 'entities/dashboard-data/model/store';
import { Errors } from 'shared/lib/validators';
import { getEntities } from './utils';
import { LS } from 'shared/lib/local-storage';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { api, API_PATHS } from 'shared/api';
import { ResGetGoogleData, ReqGetGoogleData } from 'shared/types';
import { CustomAxiosError } from 'app/providers/store';
import cfg from 'app/config';

export const getData = async (reqData: ReqGetGoogleData) => {
  const { companyId, dashboardSheetId } = reqData;
  useDashboardDataStore.getState().startLoading();

  try {
    const { data } = await api.post(API_PATHS.google.getData, { companyId, dashboardSheetId });

    // **
    // For development - сохраняем входящие данные в localStorage
    __devLog('getData', 'GS data: ', data);
    LS.devSetGSData(companyId, data);

    const gsData = getEntities(data);
    __devLog('getData', 'gsData: ', gsData);

    useUIStore.getState().setSuccessMessage('Данные с гугл-таблицы загружены');
    useUIStore.getState().setPageLoading({ 'get-g-data': { text: '', name: 'getData' } });

    useDashboardDataStore.getState().finishGetData({
      companyId,
      startEntities: gsData.startEntities || {},
      startDates: gsData.startDates || {},
    });

    return {
      companyId,
      data: gsData,
    } as ResGetGoogleData;
  } catch (e) {
    const axiosError = e as CustomAxiosError;
    useUIStore.getState().setPageLoading(); // Снять крутилку

    if (axiosError?.code === 'ECONNABORTED') {
      useUIStore.getState().setWarningMessage('Отсутствует интернет-соединение. Попробуйте позже.');
    } else {
      useUIStore
        .getState()
        .setWarningMessage(axiosError?.response?.data?.general || 'Ошибка загрузки данных гугл-таблицы');
    }

    useDashboardDataStore.getState().failGetData(
      axiosError?.response?.data || {
        general: 'Error in features/dashboard/getData',
      },
    );
  }
};
