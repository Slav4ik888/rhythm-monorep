import { Context } from '../../../app/types/global';
import { createLogTemp, loggerUser as logger } from '../../../libs/loggers';
import { updateUserModel } from '../../../models/user/handlers/update';
import { getUserId } from '../../../models/user';
import { PartialUser } from '../../../models/user/types';
import { responseError } from '../../../views';

export async function userUpdateController(ctx: Context): Promise<any> {
  const logTemp = createLogTemp(ctx, 'userUpdate'),
    error = responseError(ctx, logger, logTemp);

  try {
    const { userData } = ctx.request.body as { userData: PartialUser };
    const userId = getUserId(ctx);

    await updateUserModel({ userData, userId });
    ctx.status = 200;

    logger.info(`${logTemp} success`);
  } catch (err) {
    error(err);
  }
}
