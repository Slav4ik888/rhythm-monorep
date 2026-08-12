import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceGetCompany } from '../../../company/services';
import { serviceGoogleGetData } from '../../services';

export interface GoogleGetDataArgs {
  companyId: string;
  dashboardSheetId: string | undefined; // For check доступ (для неавторизованных)
}

/**
 * Возвращает данные из Google Sheets.
 *
 * Проверка сессии (checkUserSession) вынесена на уровень контроллера.
 *
 * @returns string — сырые данные (CSV/HTML) из Google скрипта
 */
export const googleGetDataModel = async (args: GoogleGetDataArgs): Promise<string> => {
  const { companyId, dashboardSheetId } = args;

  if (!companyId) {
    throw Object.assign(new Error(getErrorText(ERROR_NAME.INVALID_DATA, 'companyId')), {
      statusCode: 400,
      body: { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') },
    });
  }

  const company = await serviceGetCompany(companyId);

  if (!company?.googleData?.url) {
    throw Object.assign(new Error('В данных по компании отсутствует url для Google Data'), {
      statusCode: 400,
      body: { general: 'В данных по компании отсутствует url для Google Data' },
    });
  }

  const data = await serviceGoogleGetData(company.googleData.url);

  return data;
};

/** Сигнатура для обратной совместимости с Koa-контроллером */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export { googleGetDataModel as getData };
