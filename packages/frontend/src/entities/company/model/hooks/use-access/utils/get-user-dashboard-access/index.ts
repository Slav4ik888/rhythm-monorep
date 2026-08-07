import { ParamsCompany } from '../../../../../types';
import { CompanyDashboardMember } from '../../types';

/**
 * Get user`s access to dashboard from companyProfile
 */
export const getUserDashboardAccess = (
  company   : ParamsCompany,
  userEmail : string,
): CompanyDashboardMember | undefined => {
  if (! company || ! company.dashboardMembers) return undefined;

  return company.dashboardMembers.find(member => member.e === userEmail);
};
