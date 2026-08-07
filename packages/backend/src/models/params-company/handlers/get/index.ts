import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { Company, serviceGetCompany } from '../../../company';


interface GetCompanyModel {
  companyId        : string
  dashboardSheetId : string | undefined // к какой странице запрашивается доступ
}

export const getParamsCompanyModel = async (ctx: Context): Promise<Company> => {
  const { companyId, dashboardSheetId } = ctx.request.body as GetCompanyModel;

  if (! companyId) return ctx.throw(400, { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') + ` [${companyId}]` })

  // TODO: Получать не целиком данные компании а только для проверки полномочий доступа
  // TODO: Check permissons for companyId
  // для неавторизованных отдавать только необходимые поля

  const company = await serviceGetCompany(companyId);

  if (ctx.state.callback) return company;
  else ctx.body = company;
};
