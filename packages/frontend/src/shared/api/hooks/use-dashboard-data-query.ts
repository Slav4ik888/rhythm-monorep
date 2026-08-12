// packages/frontend/src/shared/api/hooks/use-dashboard-data-query.ts
// TanStack Query-хук для получения данных из Google Sheets (GET /getData)
// Заменяет ручные API-вызовы в features/dashboard-data/get-data

import { useQuery } from '@tanstack/react-query';
import { useDashboardDataStore } from 'entities/dashboard-data';
import { useUIStore } from 'entities/ui';
import { LS } from 'shared/lib/local-storage';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { api, API_PATHS } from 'shared/api';
import type { ResGetGoogleData, ReqGetGoogleData } from 'shared/types';
import { queryKeys } from '../query-keys';
import { getEntities } from 'features/dashboard-data/get-data/model/services/get-data/utils';

/**
 * Хук для получения данных с Google Sheets.
 * Автоматически обновляет Zustand-стор dashboard-data при успешном ответе.
 */
export const useGetDashboardDataQuery = (params: ReqGetGoogleData & { enabled?: boolean }) => {
  const { companyId, dashboardSheetId, enabled: queryEnabled } = params;
  const isLoading = useDashboardDataStore((s) => s.loading);

  return useQuery({
    queryKey: queryKeys.dashboard.data(companyId, dashboardSheetId),
    queryFn: async ({ signal }): Promise<ResGetGoogleData> => {
      useDashboardDataStore.getState().startLoading();

      const { data } = await api.post(API_PATHS.google.getData, { companyId, dashboardSheetId }, { signal });

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

      return { companyId, data: gsData } as ResGetGoogleData;
    },
    enabled: queryEnabled ?? (!!companyId && !!dashboardSheetId),
    staleTime: 2 * 60 * 1000, // Данные из Google Sheets — 2 минуты
    retry: 2,
  });
};
