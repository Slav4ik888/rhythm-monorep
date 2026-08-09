// packages/frontend/src/shared/api/features/company/index.ts

import { api } from '../../api';
import { API_PATHS } from '../../api-paths';
import { useCompanyStore, ParamsCompany, PartialCompany } from 'entities/company';
import { useUIStore } from 'entities/ui';

export interface ReqGetCompany {
  companyId: string;
  dashboardSheetId: string;
}

export interface DeleteSheet {
  companyId: string;
  sheetId: string;
}

export const getParamsCompany = async ({ companyId, dashboardSheetId }: ReqGetCompany): Promise<ParamsCompany> => {
  const store = useCompanyStore.getState();
  store.startLoading();
  try {
    const { data } = await api.get<ParamsCompany>(
      `${API_PATHS.paramsCompany.get}?companyId=${companyId}&dashboardSheetId=${dashboardSheetId}`,
    );
    store.finishGetParamsCompany(data);
    return data;
  } catch (err: any) {
    const errors = err?.response?.data?.errors || { default: err.message };
    useUIStore.getState().setErrorStatus(err?.response?.status || 0);
    store.failGetParamsCompany(errors);
    throw err;
  }
};

export const updateCompany = async (company: PartialCompany): Promise<void> => {
  const store = useCompanyStore.getState();
  store.startLoading();
  try {
    const { data } = await api.post(API_PATHS.company.update, company);
    store.finishUpdateCompany(data as Partial<ParamsCompany>);
    await getParamsCompany({ companyId: company.id!, dashboardSheetId: '' });
  } catch (err: any) {
    const errors = err?.response?.data?.errors || { default: err.message };
    useUIStore.getState().setErrorStatus(err?.response?.status || 0);
    store.failUpdateCompany(errors);
    throw err;
  }
};

export const deleteSheet = async ({ companyId, sheetId }: DeleteSheet): Promise<void> => {
  const store = useCompanyStore.getState();
  store.startLoading();
  try {
    await api.post(API_PATHS.company.deleteSheet, { companyId, sheetId });
    store.finishDeleteSheet(sheetId);
  } catch (err: any) {
    const errors = err?.response?.data?.errors || { default: err.message };
    useUIStore.getState().setErrorStatus(err?.response?.status || 0);
    store.failDeleteSheet(errors);
    throw err;
  }
};
