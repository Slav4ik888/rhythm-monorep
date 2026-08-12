import { Context } from '../../../app/types/global';
import { createLogTemp, loggerCompany as logger } from '../../../libs/loggers';
import { companyDeleteSheetModel, DeleteSheetArgs } from '../../../models/company/handlers/delete-sheet';
import { getUserId } from '../../../models/user';
import { responseError } from '../../../views';

export async function companyDeleteSheetController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'companyDeleteSheet'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { companyId, sheetId } = ctx.request.body as DeleteSheetArgs;
    const userId = getUserId(ctx);

    await companyDeleteSheetModel({ companyId, sheetId, userId });
    ctx.body = ctx.request.body;
    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
