import { Next } from 'koa';
import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { checkUserSession } from '../../../../middleware/session-caches';
import { serviceGetCompany } from '../../../company';
import { serviceGoogleGetData } from '../../services';



interface GoogleGetDataModel {
  companyId        : string
  dashboardSheetId : string | undefined // For check доступ (для неавторизованных)
}

export const googleGetDataModel = async (ctx: Context, next: Next): Promise<any> => {
  const { companyId, dashboardSheetId } = ctx.request.body as GoogleGetDataModel;

  if (! companyId) return ctx.throw(400, { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') })

  // TODO: Check permissons for companyId

  const company = await serviceGetCompany(companyId);
  if (! company?.googleData?.url) return ctx.throw(400, { general: 'В данных по компании отсутствует url для Google Data' })

  // Check доступ (для неавторизованных)
  if (! company?.dashboardPublicAccess?.[dashboardSheetId]) {
    // Нет публичного доступа
    await checkUserSession(ctx, next);
  }

  const data = await serviceGoogleGetData(company?.googleData?.url);

  ctx.body = data;
};
