import { serviceIncreaseFollower } from '../../services';
import { isValidPartnerId } from '../../utils';
import { sendNotifications } from './send-notifications';

export interface IncreaseFollowerConfig {
  partnerId: string;
}

/**
 * Увеличивает счётчик follower для партнёра.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает partnerId напрямую,
 * выбрасывает ошибку вместо ctx.throw.
 */
export const increaseFollowerModel = async (config: IncreaseFollowerConfig): Promise<void> => {
  const { partnerId } = config;

  if (!isValidPartnerId(partnerId)) {
    throw Object.assign(new Error('Invalid partnerId'), {
      statusCode: 400,
      body: { general: 'Invalid partnerId' },
    });
  }

  await serviceIncreaseFollower(partnerId);
  await sendNotifications(partnerId);
};
