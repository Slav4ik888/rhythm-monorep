import { Context } from '../../../../app/types/global';
import { serviceUpdateUser } from '../../services';
import { PartialUser } from '../../types';
import { getUserId } from '../../utils';



export interface UpdatedConfig {
  userData: PartialUser
}


/**
 * @requires body as UpdatedConfig
 */
export const updateUserModel = async (ctx: Context): Promise<void> => {
  const { userData } = ctx.request.body as UpdatedConfig;
  const userId = getUserId(ctx);

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated

  // TODO: validateUser(ctx, userData);

  // Update
  await serviceUpdateUser(userData, userId);

  ctx.status = 200;
};
