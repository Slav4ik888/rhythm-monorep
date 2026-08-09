// packages/frontend/src/entities/company/model/hooks/use-company/index.ts

import { useMemo } from 'react';
import { useCompanyStore } from '../../store';
import { getChanges } from 'shared/helpers/objects';
import { Errors } from 'shared/lib/validators';
import type { CustomSettings, ParamsCompany, PartialCompany } from '../../../types';
import { ReqGetCompany, getParamsCompany, updateCompany, DeleteSheet, deleteSheet } from 'shared/api/features/company';

interface Config {
  dashboardSheetId?: string;
}

export const useCompany = (config: Config = {}) => {
  const { dashboardSheetId = 'main' } = config;

  const loading = useCompanyStore((state) => state.loading);
  const errors = useCompanyStore((state) => state.errors);
  const _isParamsCompanyIdLoaded = useCompanyStore((state) => state._isParamsCompanyIdLoaded);
  const paramsCompany = useCompanyStore((state) => state.paramsCompany);
  const company = useCompanyStore((state) => state.company);
  const storedCompany = useCompanyStore((state) => state.storedCompany);

  const paramsCompanyId = paramsCompany?.id;
  const paramsBunchesUpdated = paramsCompany?.bunchesUpdated;
  const paramsCustomSettings = paramsCompany?.customSettings || {};
  const paramsChangedCompany = getChanges(storedCompany, paramsCompany); // Объект с изменившимися полями
  const paramsSheets = paramsCompany?.sheets || {};
  const usersAccessDashboard = paramsCompany?.dashboardMembers || [];
  const dashboardPublicAccess = paramsCompany?.dashboardPublicAccess?.[dashboardSheetId];
  const companyId = company?.id;

  const api = useMemo(
    () => ({
      setErrors: (errors?: Errors) => useCompanyStore.getState().setErrors(errors),
      setIsParamsCompanyIdLoaded: (status: boolean) => useCompanyStore.getState().setIsParamsCompanyIdLoaded(status),
      updateParamsCustomSettings: (data: Partial<CustomSettings>) =>
        useCompanyStore.getState().updateParamsCustomSettings(data),
      cancelParamsCustomSettings: () => useCompanyStore.getState().cancelParamsCustomSettings(),
      updateParamsCompany: (data: Partial<ParamsCompany>) => useCompanyStore.getState().updateParamsCompany(data),

      serviceGetParamsCompany: (data: ReqGetCompany) => getParamsCompany(data),
      serviceUpdateCompany: (company: PartialCompany) => updateCompany(company),
      serviceDeleteSheet: (data: DeleteSheet) => deleteSheet(data),
    }),
    [],
  );

  return {
    loading,
    errors,
    _isParamsCompanyIdLoaded,
    paramsCompany,
    paramsCompanyId,
    paramsBunchesUpdated,
    paramsCustomSettings,
    paramsChangedCompany,
    paramsSheets,
    usersAccessDashboard,
    dashboardPublicAccess,

    company,
    companyId,
    storedCompany,
    ...api,
  };
};
