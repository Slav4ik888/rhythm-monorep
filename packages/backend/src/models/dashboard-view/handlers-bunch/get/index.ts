// packages/backend/src/models/dashboard-view/handlers-bunch/get/index.ts
// Рефакторинг: убран ctx, принимает ReqGetBunches, возвращает результат

import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceGetCompany } from '../../../company';
import { serviceGetDashboardBunches } from '../../services';
import { BunchesViewItem } from '../../types';

/** 2025-07-16 */
export interface ResGetBunches {
  bunches: BunchesViewItem;
}

export interface ReqGetBunches {
  companyId: string;
  bunchIds: string[]; // То что надо загрузить
  dashboardSheetId: string | undefined; // For check доступ (для неавторизованных)
}

/**
 * Get all BunchsByCompanyId
 */
export async function getBunchesModel(args: ReqGetBunches): Promise<ResGetBunches> {
  const { companyId, bunchIds, dashboardSheetId } = args;

  if (!companyId) {
    throw Object.assign(new Error('Invalid data'), {
      statusCode: 400,
      body: { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') },
    });
  }

  const company = await serviceGetCompany(companyId);

  // TODO: Check доступ к переданной companyId (для авторизованных)

  // Check доступ (для неавторизованных)
  if (!company?.dashboardPublicAccess?.[dashboardSheetId]) {
    // Нет публичного доступа
  }

  const bunches = await serviceGetDashboardBunches(companyId, bunchIds);

  return { bunches };
}
