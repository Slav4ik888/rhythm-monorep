// packages/backend/src/models/dashboard-view/handlers-bunch/get/index.ts

import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { checkDashboardAccess } from '../../../company/access';
import { serviceGetCompany } from '../../../company';
import { CompanyDashboardAccessScheme } from '../../../company/types/access';
import type { User } from '../../../user/types';
import { NO_SHEET_ID } from '../../consts';
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
  user?: User; // Опционально: аутентифицированный пользователь (OptionalFirebaseAuthGuard)
}

/**
 * Get all BunchsByCompanyId
 */
export async function getBunchesModel(args: ReqGetBunches): Promise<ResGetBunches> {
  const { companyId, bunchIds, dashboardSheetId, user } = args;

  if (!companyId) {
    throw Object.assign(new Error('Invalid data'), {
      statusCode: 400,
      body: { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') },
    });
  }

  const company = await serviceGetCompany(companyId);

  if (!company) {
    throw Object.assign(new Error('Компания не найдена'), {
      statusCode: 404,
      body: { general: 'Компания не найдена' },
    });
  }

  // Проверка доступа: публичный просмотр, участник с доступом или владелец.
  // Зеркалит фронтовую checkDashboardAccess (requiredAccess = 'v' — просмотр).
  const canView = checkDashboardAccess(
    company,
    user?.email,
    CompanyDashboardAccessScheme.AF,
    'v',
    dashboardSheetId || NO_SHEET_ID,
  );

  if (!canView) {
    throw Object.assign(new Error('Нет доступа к дашборду'), {
      statusCode: 403,
      body: { general: 'Нет доступа к дашборду' },
    });
  }

  const bunches = await serviceGetDashboardBunches(companyId, bunchIds);

  return { bunches };
}
