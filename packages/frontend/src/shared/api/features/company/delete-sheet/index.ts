// packages/frontend/src/shared/api/features/company/delete-sheet/index.ts

import { useCompanyStore } from 'entities/company';
import { api } from '../../..';
import { API_PATHS } from '../../../api-paths';

export interface DeleteSheet {
  companyId: string;
  sheetId: string;
}

/**
 * Delete one sheet by id
 */
export const deleteSheet = async (companyData: DeleteSheet) => {
  useCompanyStore.getState().startLoading();

  try {
    const { data } = await api.patch<DeleteSheet>(API_PATHS.company.deleteSheet, companyData);

    useCompanyStore.getState().finishDeleteSheet(data.sheetId);
  } catch (e: any) {
    useCompanyStore.getState().failDeleteSheet({ general: 'Error in features/company/deleteSheet' });
  }
};
