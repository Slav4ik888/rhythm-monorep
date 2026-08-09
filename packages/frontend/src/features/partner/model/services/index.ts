// packages/frontend/src/features/partner/model/services/index.ts

import { api, API_PATHS } from 'shared/api';

interface IncreasePartnerFollowerReq {
  partnerId: string;
}

/** Увеличить счётчик последователей партнёра */
export const increasePartnerFollower = async (payload: IncreasePartnerFollowerReq): Promise<void> => {
  await api.post(API_PATHS.partner.increaseFollower, payload);
};
