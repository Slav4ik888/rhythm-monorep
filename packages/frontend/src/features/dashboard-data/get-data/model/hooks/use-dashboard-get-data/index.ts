// packages/frontend/src/features/dashboard-data/get-data/model/hooks/use-dashboard-get-data/index.ts

import { useMemo } from 'react';
import { getData } from '../../services';
import { ReqGetGoogleData } from 'shared/types';

/** Хук для получения данных с гугл-таблицы (обёртка над прямой async-функцией) */
export const useDashboardGetData = () => {
  const api = useMemo(
    () => ({
      serviceGetData: (data: ReqGetGoogleData) => getData(data),
    }),
    [],
  );

  return {
    ...api,
  };
};
