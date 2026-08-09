// packages/backend/src/models/params-company/handlers/get/index.ts

import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { Company, serviceGetCompany } from '../../../company';

interface GetCompanyModel {
  companyId: string;
  dashboardSheetId: string | undefined; // к какой странице запрашивается доступ
}

export const getParamsCompanyModel = async (ctx: Context): Promise<Company> => {
  // Поддержка и GET (query-параметры), и POST (body)
  const body = (ctx.request.body || {}) as GetCompanyModel;
  const query = (ctx.query || {}) as unknown as GetCompanyModel;
  const companyId = body.companyId || query.companyId;
  const dashboardSheetId = body.dashboardSheetId || query.dashboardSheetId;

  if (!companyId) {
    return ctx.throw(400, {
      general: `${getErrorText(ERROR_NAME.INVALID_DATA, 'companyId')} [${companyId}]`,
    });
  }

  // TODO: Получать не целиком данные компании а только для проверки полномочий доступа
  // TODO: Check permissons for companyId
  // для неавторизованных отдавать только необходимые поля

  const company = await serviceGetCompany(companyId);

  if (ctx.state.callback) return company;
  else ctx.body = company;
};
