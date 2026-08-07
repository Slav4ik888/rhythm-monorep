import { Context } from '../../../../app/types/global';
import { serviceIncreaseFollower } from '../../services';
import { isValidPartnerId } from '../../utils';
import { sendNotifications } from './send-notifications';



export interface IncreaseFollowerConfig {
  partnerId: string
}


/**
 * @requires body as Config
 */
export const increaseFollowerModel = async (ctx: Context): Promise<void> => {
  const { partnerId } = ctx.request.body as IncreaseFollowerConfig;

  if (! isValidPartnerId(partnerId)) return ctx.throw(400, { general: 'Invalid partnerId' });

  await serviceIncreaseFollower(ctx);
  await sendNotifications(ctx);

  ctx.status = 200;
};
