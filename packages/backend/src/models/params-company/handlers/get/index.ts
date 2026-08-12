// packages/backend/src/models/params-company/handlers/get/index.ts

import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { Company, serviceGetCompany } from '../../../company';

export interface GetParamsCompanyArgs {
  companyId: string;
  dashboardSheetId: string | undefined; // к какой странице запрашивается доступ
}

/**
 * Получает параметры компании по companyId.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает явные аргументы,
 * выбрасывает ошибку вместо ctx.throw.
 */
export const getParamsCompanyModel = async (args: GetParamsCompanyArgs): Promise<Company> => {
  const { companyId } = args;

  if (!companyId) {
    const message = `${getErrorText(ERROR_NAME.INVALID_DATA, 'companyId')} [${companyId}]`;
    throw Object.assign(new Error(message), { statusCode: 400, body: { general: message } });
  }

  // TODO: Получать не целиком данные компании а только для проверки полномочий доступа
  // TODO: Check permissons for companyId
  // для неавторизованных отдавать только необходимые поля

  const company = await serviceGetCompany(companyId);
  return company;
};
