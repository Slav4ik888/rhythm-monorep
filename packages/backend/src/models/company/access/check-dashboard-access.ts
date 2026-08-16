// packages/backend/src/models/company/access/check-dashboard-access.ts
// Зеркалит фронтовую подсистему entities/company/model/hooks/use-access/utils/check-dashboard-access.

import { getValueByScheme } from '../../../shared/utils/objects';
import { NO_SHEET_ID } from '../../dashboard-view/consts';
import type { AccessLevel, CompanyDashboardAccessScheme } from '../types/access';
import type { Company } from '../types/company';
import { canAccess } from './can-access';
import { ACCESS_PRIORITY } from './consts';
import { getUserDashboardAccess } from './get-user-dashboard-access';
import { isOwner } from './is-owner';

/**
 * Проверяет права пользователя на доступ к дашборду (или конкретной вкладке).
 * Порядок проверок совпадает с фронтом:
 * 1. владелец — проходит всегда;
 * 2. публичная страница (только просмотр);
 * 3. неавторизованный — отказ;
 * 4. участник дашборда с достаточным уровнем прав.
 */
export const checkDashboardAccess = (
  company: Company | undefined,
  userEmail: string | undefined,
  scheme: CompanyDashboardAccessScheme, // 'a.f'
  requiredAccess: AccessLevel,
  dashboardPageId: string = NO_SHEET_ID,
): boolean => {
  if (!company) return false;

  // Владелец
  if (isOwner(company, userEmail)) return true;

  // Публичная страница (даёт только просмотр, не редактирование)
  if (company.dashboardPublicAccess?.[dashboardPageId] && ACCESS_PRIORITY[requiredAccess] < ACCESS_PRIORITY.e) {
    return true;
  }

  // Неавторизованный
  if (!userEmail) return false;

  const allUserAccess = getUserDashboardAccess(company, userEmail);
  const userAccess = getValueByScheme(allUserAccess, scheme) as AccessLevel | undefined;

  return canAccess(userAccess, requiredAccess);
};
