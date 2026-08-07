import { getValueByScheme } from 'shared/helpers/objects';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { ParamsCompany } from '../../../../../types';
import { getUserDashboardAccess } from '../get-user-dashboard-access';
import { canAccess } from '../can-access';
import { isOwner } from '../is-owner';
import { AccessLevel, CompanyDashboardAccessScheme } from '../../types';
import { ACCESS_PRIORITY } from '../../consts';
import { NO_SHEET_ID } from 'entities/dashboard-view';



/**
 * Check permissions by scheme
 */
export const checkDashboardAccess = (
  company         : ParamsCompany,
  userEmail       : string | undefined,
  scheme          : CompanyDashboardAccessScheme, // 'a.f'
  requiredAccess  : AccessLevel,
  // для корневой страницы dashboardPageId = undefined
  // window.location.pathname.split('/')[3]
  dashboardPageId : string = NO_SHEET_ID
) => {
  // Если пользователь - владелец
  if (isOwner(company, userEmail)) return true;

  // Если страница доступна для всех
  if (
    company.dashboardPublicAccess?.[dashboardPageId]
    && ACCESS_PRIORITY[requiredAccess] < ACCESS_PRIORITY.e // requiredAccess < 'e' (не редактирование)
  ) {
    // __devLog('checkDashboardAccess', `checkAccess[public page][${dashboardPageId}]`);
    return true;
  }

  // Если пользователь не авторизован
  if (! userEmail) return false;

  // Достаём все полномочия пользователя от этой компании
  const allUserAccess = getUserDashboardAccess(company, userEmail);

  // Какие полномочия пользователя по этой scheme
  const userAccess = getValueByScheme(allUserAccess, scheme);

  // Соответствуют ли права на запрошенную операцию
  const result = canAccess(userAccess, requiredAccess);
  // __devLog('checkDashboardAccess', `checkAccess[${requiredAccess}][${userEmail}][${scheme}]:`, result);

  return result
};
