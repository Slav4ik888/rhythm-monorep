// packages/frontend/src/shared/api/features/user/logout/logout.test.ts

import { logout } from './index';
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

describe('logout', () => {
  it('отправляет POST на /user/logout', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    await logout();

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(API_PATHS.user.logout);
  });
});
