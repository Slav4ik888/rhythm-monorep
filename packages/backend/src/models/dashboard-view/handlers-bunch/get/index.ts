import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceGetCompany } from '../../../company';
// import { NO_SHEET_ID } from '../../consts';
import { serviceGetDashboardBunches } from '../../services';
import { BunchesViewItem } from '../../types';



/** 2025-07-16 */
interface ResGetBunches {
  bunches: BunchesViewItem
}

interface ReqGetBunches {
  companyId        : string
  bunchIds         : string[]            // То что надо загрузить
  dashboardSheetId : string | undefined  // For check доступ (для неавторизованных)
}

/**
 * Get all BunchsByCompanyId
 */
export async function getBunchesModel(ctx: Context): Promise<any> {
  const { companyId, bunchIds, dashboardSheetId } = ctx.request.body as ReqGetBunches;

  if (! companyId) return ctx.throw(400, { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') })

  const company = await serviceGetCompany(companyId);

  // TODO: Check доступ к переданной companyId (для авторизованных)

  // Check доступ (для неавторизованных)
  if (! company?.dashboardPublicAccess?.[dashboardSheetId]) {
    // Нет публичного доступа
  }

  const bunches = await serviceGetDashboardBunches(companyId, bunchIds);

  ctx.body = {
    bunches
  };
}
