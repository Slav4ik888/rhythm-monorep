import { Context, Next } from 'koa';
import { GoogleGetDataArgs, getData as googleGetDataModel } from '../../../models/google/handlers';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import { responseError } from '../../../views';
import { checkUserSession } from '../../../middleware/session-caches';
import { serviceGetCompany } from '../../../models/company';

export async function googleGetDataController(ctx: Context, next: Next): Promise<void> {
  const logTemp = createLogTemp(ctx, 'googleGetData'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { companyId, dashboardSheetId } = ctx.request.body as GoogleGetDataArgs;

    // Проверка сессии для непубличных дашбордов (сохранена из модели)
    if (companyId && dashboardSheetId) {
      const company = await serviceGetCompany(companyId);
      if (!company?.dashboardPublicAccess?.[dashboardSheetId]) {
        await checkUserSession(ctx, next);
      }
    }

    const data = await googleGetDataModel({ companyId, dashboardSheetId });
    ctx.body = data;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
