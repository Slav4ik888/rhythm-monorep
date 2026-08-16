// packages/backend/src/models/company/access/can-edit-dashboard.ts

import type { User } from '../../user/types';
import { CompanyDashboardAccessScheme } from '../types/access';
import type { Company } from '../types/company';
import { canEditCompany } from './can-edit-company';
import { checkDashboardAccess } from './check-dashboard-access';

/** Может ли пользователь редактировать дашборд компании */
export const canEditDashboard = (user: User | undefined, company: Company | undefined): boolean => {
  if (!user || !company) return false;
  if (canEditCompany(user, company)) return true;

  return checkDashboardAccess(company, user.email, CompanyDashboardAccessScheme.AF, 'e');
};
