// packages/frontend/src/shared/api/features/user/update-user/update-user.test.ts

import { updateUser } from './index';
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

describe('updateUser', () => {
  it('отправляет POST на /user/update с переданным payload', async () => {
    const payload = { name: 'Иван', email: 'ivan@mail.com' };

    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    await updateUser(payload);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(API_PATHS.user.update, payload);
  });
});
