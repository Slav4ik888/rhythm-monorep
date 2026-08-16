import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceDashboardViewGetAllViewItems } from '../../../dashboard-view/services';
import type { User } from '../../../user/types';
import { assertCanEditCompany } from '../../access';
import { serviceCompanyDeleteSheet, serviceGetCompany } from '../../services';
import { isSheetNotEmpty } from '../../utils';

/** Аргументы для удаления листа */
export interface DeleteSheetArgs {
  companyId: string;
  sheetId: string;
  user: User;
}

/**
 * Удаляет лист (sheet) компании.
 * Проверяет права (владелец или привилегированная роль).
 */
export const companyDeleteSheetModel = async (args: DeleteSheetArgs): Promise<void> => {
  const { companyId, sheetId, user } = args;

  if (!companyId || !sheetId) {
    throw Object.assign(new Error(getErrorText(ERROR_NAME.INVALID_DATA)), {
      statusCode: 400,
      body: { general: getErrorText(ERROR_NAME.INVALID_DATA) },
    });
  }

  // Проверка прав: удалять листы может только владелец или привилегированная роль
  const company = await serviceGetCompany(companyId);
  assertCanEditCompany(user, company);

  // Проверка наличия вложенных ViewItems - Нельзя удалять пока они есть
  const viewItems = await serviceDashboardViewGetAllViewItems(companyId);
  if (isSheetNotEmpty(viewItems, sheetId)) {
    throw Object.assign(new Error('Нельзя удалить вкладку, пока есть вложенные элементы'), {
      statusCode: 400,
      body: { general: 'Нельзя удалить вкладку, пока есть вложенные элементы' },
    });
  }

  // Delete
  await serviceCompanyDeleteSheet(companyId, sheetId, user.id);
};

/** Сигнатура для обратной совместимости с Koa-контроллером */
export { companyDeleteSheetModel as deleteSheet };
