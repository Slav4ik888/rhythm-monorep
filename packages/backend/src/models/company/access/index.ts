// packages/backend/src/models/company/access/index.ts

export { ACCESS_PRIORITY } from './consts';
export { isOwner } from './is-owner';
export { isPrivileged } from './is-privileged';
export { getUserDashboardAccess } from './get-user-dashboard-access';
export { canAccess } from './can-access';
export { checkDashboardAccess } from './check-dashboard-access';
export { canEditCompany } from './can-edit-company';
export { canEditDashboard } from './can-edit-dashboard';
export { assertCanEditCompany, assertCanEditDashboard, assertCanEditTemplates } from './assert';
