// packages/frontend/src/features/partner/model/services/partner.test.ts

import { increasePartnerFollower } from './index';
import { api } from 'shared/api';
import { API_PATHS } from 'shared/api/api-paths';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: { create: jest.fn(() => instance) },
  };
});

describe('increasePartnerFollower', () => {
  it('отправляет POST /increaseFollower с partnerId', async () => {
    const payload = { partnerId: 'partner-1' };

    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    await increasePartnerFollower(payload);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(API_PATHS.partner.increaseFollower, payload);
  });
});
