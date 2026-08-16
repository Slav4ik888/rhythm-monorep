// packages/backend/src/models/company/utils/filter-company-data/index.ts

import { pick } from '../../../../shared/utils/objects/pick';
import type { PartialCompany } from '../../types';

/** Поля компании, которые разрешено обновлять через /company/update */
export const COMPANY_UPDATE_ALLOWED_FIELDS = [
  'id',
  'companyName',
  'logoUrl',
  'googleData',
  'customSettings',
  'sheets',
  'dashboardMembers',
  'companyMembers',
  'dashboardPublicAccess',
] as const;

/**
 * Оставляет только разрешённые поля компании (защита от mass assignment).
 * Запрещено менять через update: ownerId, owner, status, createdAt, lastChange.
 */
export const filterCompanyData = (company: PartialCompany): PartialCompany =>
  pick(company, COMPANY_UPDATE_ALLOWED_FIELDS);
