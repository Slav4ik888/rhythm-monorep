import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceDashboardViewGetAllViewItems } from '../../../dashboard-view/services';
import { serviceCompanyDeleteSheet } from '../../services';
import { isSheetNotEmpty } from '../../utils';

/** Аргументы для удаления листа (рефакторинг: без ctx) */
export interface DeleteSheetArgs {
  companyId: string;
  sheetId: string;
  userId: string;
}

/**
 * Удаляет лист (sheet) компании.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает аргументы напрямую.
 */
export const companyDeleteSheetModel = async (args: DeleteSheetArgs): Promise<void> => {
  const { companyId, sheetId, userId } = args;

  if (!companyId || !sheetId) {
    throw Object.assign(new Error(getErrorText(ERROR_NAME.INVALID_DATA)), {
      statusCode: 400,
      body: { general: getErrorText(ERROR_NAME.INVALID_DATA) },
    });
  }

  // TODO: Permissions

  // Проверка наличия вложенных ViewItems - Нельзя удалять пока они есть
  const viewItems = await serviceDashboardViewGetAllViewItems(companyId);
  if (isSheetNotEmpty(viewItems, sheetId)) {
    throw Object.assign(new Error('Нельзя удалить вкладку, пока есть вложенные элементы'), {
      statusCode: 400,
      body: { general: 'Нельзя удалить вкладку, пока есть вложенные элементы' },
    });
  }

  // Delete
  await serviceCompanyDeleteSheet(companyId, sheetId, userId);
};

/** Сигнатура для обратной совместимости с Koa-контроллером */
export { companyDeleteSheetModel as deleteSheet };
