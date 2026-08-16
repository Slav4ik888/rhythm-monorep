// packages/backend/src/models/params-company/handlers/get/index.ts

import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceGetCompany } from '../../../company';
import { toParamsCompany } from '../../../company/utils';
import type { ParamsCompany } from '../../../company/types';

export interface GetParamsCompanyArgs {
  companyId: string;
  dashboardSheetId: string | undefined; // к какой странице запрашивается доступ
}

/**
 * Получает параметры компании по companyId (публичный эндпоинт).
 * Отдаёт только публичные поля (без ownerId и служебных таймстампов).
 */
export const getParamsCompanyModel = async (args: GetParamsCompanyArgs): Promise<ParamsCompany> => {
  const { companyId } = args;

  if (!companyId) {
    const message = `${getErrorText(ERROR_NAME.INVALID_DATA, 'companyId')} [${companyId}]`;
    throw Object.assign(new Error(message), { statusCode: 400, body: { general: message } });
  }

  const company = await serviceGetCompany(companyId);

  if (!company) {
    const message = 'Компания не найдена';
    throw Object.assign(new Error(message), { statusCode: 404, body: { general: message } });
  }

  // Публичная проекция: только поля, нужные не-владельцу (без ownerId, createdAt, lastChange)
  return toParamsCompany(company);
};
