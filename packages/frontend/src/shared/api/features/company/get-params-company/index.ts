// packages/frontend/src/shared/api/features/company/get-params-company/index.ts

import { ParamsCompany, useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';
import { api } from '../../..';
import { API_PATHS } from '../../../api-paths';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { cloneObj } from 'shared/helpers/objects';

export interface ReqGetCompany {
  companyId: string;
  dashboardSheetId: string | undefined; // к какой странице запрашивается доступ
}

export interface SetParamsCompany {
  paramsCompany: ParamsCompany;
}

/** Возвращает данные компании. */
export const getParamsCompany = async (companyData: ReqGetCompany) => {
  useCompanyStore.getState().startLoading();

  try {
    let paramsCompany = {} as ParamsCompany;

    // На время разработки, использовать данные сохраннённые в LS,
    // а также случай отсутствия интернета (для разработки)
    if (cfg.IS_DEV) {
      paramsCompany = LS.getParamsCompanyState() as ParamsCompany;
    } else {
      const { data } = await api.post<ParamsCompany>(API_PATHS.paramsCompany.get, companyData);
      paramsCompany = cloneObj(data);
    }

    useUIStore.getState().setPageLoading({ 'get-params-company': { text: '', name: 'getParamsCompany' } });

    useCompanyStore.getState().finishGetParamsCompany(paramsCompany);
  } catch (e: any) {
    useCompanyStore.getState().failGetParamsCompany(
      e?.response?.data || {
        general: 'Error in features/company/getParamsCompany',
      },
    );
  }
};
