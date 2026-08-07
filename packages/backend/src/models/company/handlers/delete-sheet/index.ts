import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceDashboardViewGetAllViewItems } from '../../../dashboard-view/services';
import { getUserId } from '../../../user';
import { serviceCompanyDeleteSheet } from '../../services';
import { isSheetNotEmpty } from '../../utils';



export interface DeleteSheet {
  companyId : string
  sheetId   : string
}


export const companyDeleteSheetModel = async (ctx: Context): Promise<void> => {
  const { companyId, sheetId } = ctx.request.body as DeleteSheet;
  const userId = getUserId(ctx);

  if (! companyId || ! sheetId) return ctx.throw(400, { general: getErrorText(ERROR_NAME.INVALID_DATA)})

  // TODO: Permissions

  // Проверка наличия вложенных ViewItems - Нельзя удалять пока они есть
  const viewItems = await serviceDashboardViewGetAllViewItems(companyId);
  if (isSheetNotEmpty(viewItems, sheetId)) return ctx.throw(400, {
    general: 'Нельзя удалить вкладку, пока есть вложенные элементы'
  });

  // Update
  await serviceCompanyDeleteSheet(companyId, sheetId, userId);

  ctx.body = ctx.request.body;
};
