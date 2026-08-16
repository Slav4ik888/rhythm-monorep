// packages/frontend/src/features/docs/get-policy/model/services/get-policy/get-policy.test.ts

import { getPolicy } from './index';
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

describe('getPolicy', () => {
  it('возвращает текст политики из ответа API', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { policy: '<p>Политика</p>' } });

    const policy = await getPolicy();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith(API_PATHS.docs.getPolicy);
    expect(policy).toBe('<p>Политика</p>');
  });
});
