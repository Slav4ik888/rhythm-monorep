// packages/backend/src/models/company/access/get-user-dashboard-access.ts

import type { CompanyDashboardMember } from '../types/access';
import type { Company } from '../types/company';

/** Ищет участника дашборда по email (как на фронте) */
export const getUserDashboardAccess = (
  company: Company | undefined,
  userEmail: string,
): CompanyDashboardMember | undefined => company?.dashboardMembers?.find((member) => member.e === userEmail);
