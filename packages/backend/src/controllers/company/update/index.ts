import { Context } from '../../../app/types/global';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import { updateCompanyModel } from '../../../models/company/handlers/update';
import { getUserId } from '../../../models/user';
import { responseError } from '../../../views';

export async function companyUpdateController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'companyUpdate'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { companyData } = ctx.request.body as { companyData: any };
    const userId = getUserId(ctx);

    const result = await updateCompanyModel({ companyData, userId });
    ctx.body = result;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
