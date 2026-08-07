import { creatorFixDate } from 'entities/base/creators';
import { cloneObj } from 'shared/helpers/objects';
import { Company, CompanyStatus } from '../../../types';


/** v2025-08-28 */
export const creatorCompany = (cfg: Partial<Company> = {} as Company): Company => cloneObj({
  id                    : cfg.id               || '',
  companyName           : cfg.companyName      || '',
  ownerId               : cfg.ownerId          || '',
  owner                 : cfg.owner            || '',

  logoUrl               : cfg.logoUrl          || '', // 'TODO: save in FB Cloude', // 'https://firebasestorage.googleapis.com/v0/b/osnova-course.appspot.com/o/no-img-company.svg?alt=media'
  status                : cfg.status           || CompanyStatus.NEW,
  // partnerCode           : cfg.partnerCode      || '',
  companyMembers        : cfg.companyMembers   || [],

  googleData            : cfg.googleData       || { url: '' }, // TODO: add to tests
  customSettings        : cfg.customSettings   || {},
  bunchesUpdated        : cfg.bunchesUpdated   || {},
  sheets                : cfg.sheets           || {},
  dashboardMembers      : cfg.dashboardMembers || [],
  dashboardPublicAccess : cfg.dashboardPublicAccess   || {},

  createdAt             : cfg.createdAt        || creatorFixDate(cfg.id),
  lastChange            : cfg.lastChange       || creatorFixDate(cfg.id)
});
