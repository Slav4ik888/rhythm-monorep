// packages/backend/src/models/company/utils/to-params-company/index.ts

import { pick } from '../../../../shared/utils/objects/pick';
import type { Company, ParamsCompany } from '../../types';

/**
 * Поля компании, которые допустимо отдавать не-владельцу (публичный запрос
 * /paramsCompany/get или просмотр чужого дашборда по ссылке).
 * Не отдаём: ownerId (Firebase UID), createdAt/lastChange (служебные таймстампы).
 */
export const PARAMS_COMPANY_FIELDS = [
  'id',
  'companyName',
  'owner',
  'logoUrl',
  'status',
  'customSettings',
  'googleData',
  'bunchesUpdated',
  'sheets',
  'dashboardMembers',
  'dashboardPublicAccess',
  'companyMembers',
] as const;

/** Проекция компании для «чужого» пользователя (без служебных полей) */
export const toParamsCompany = (company: Company): ParamsCompany =>
  pick(company, PARAMS_COMPANY_FIELDS) as ParamsCompany;
