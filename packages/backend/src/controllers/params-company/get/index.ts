import { Context } from '../../../app/types/global';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import { getParamsCompanyModel } from '../../../models/params-company/handlers/get';
import { responseError } from '../../../views';

export async function paramsCompanyGetController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'paramsCompanyGet'),
    error = responseError(ctx, logger, logTemp);

  try {
    // Поддержка и GET (query-параметры), и POST (body)
    const body = (ctx.request.body || {}) as any;
    const query = (ctx.query || {}) as any;

    const company = await getParamsCompanyModel({
      companyId: body.companyId || query.companyId,
      dashboardSheetId: body.dashboardSheetId || query.dashboardSheetId,
    });

    if (ctx.state.callback) ctx.body = company;
    else ctx.body = company;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
