// packages/frontend/src/shared/api/features/company/update-company/index.ts

import { useCompanyStore, PartialCompany } from 'entities/company';
import { useUIStore } from 'entities/ui';
import { api } from '../../..';
import { API_PATHS } from '../../../api-paths';

/**
 * Owner update Company data
 */
export const updateCompany = async (companyData: PartialCompany) => {
  useCompanyStore.getState().startLoading();

  try {
    // PATCH не работает через Vite dev-прокси (известный баг), используем POST
    const { data } = await api.post<PartialCompany>(API_PATHS.company.update, { companyData });

    useUIStore.getState().setSuccessMessage('Сохранено');

    useCompanyStore.getState().finishUpdateCompany(data);
  } catch (e: any) {
    useCompanyStore.getState().failUpdateCompany({ general: 'Error in features/company/update' });
  }
};
