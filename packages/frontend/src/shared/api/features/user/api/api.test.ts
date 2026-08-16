// packages/frontend/src/shared/api/features/user/api/api.test.ts

import { userApi } from './index';
import { API_PATHS } from '../../../api-paths';
import type { AxiosInstance } from 'axios';

describe('userApi', () => {
  let mockApi: { post: jest.Mock };

  beforeEach(() => {
    mockApi = { post: jest.fn() };
  });

  it('update: отправляет POST /user/update с обёрнутыми userData', async () => {
    const userData = { companyId: 'c1', id: 'u1', name: 'Иван' };

    (mockApi.post as jest.Mock).mockResolvedValue({ data: {} });

    await userApi.update(mockApi as unknown as AxiosInstance, userData);

    expect(mockApi.post).toHaveBeenCalledTimes(1);
    expect(mockApi.post).toHaveBeenCalledWith(API_PATHS.user.update, { userData });
  });

  it('logout: отправляет POST /user/logout', async () => {
    (mockApi.post as jest.Mock).mockResolvedValue({ data: {} });

    await userApi.logout(mockApi as unknown as AxiosInstance);

    expect(mockApi.post).toHaveBeenCalledTimes(1);
    expect(mockApi.post).toHaveBeenCalledWith(API_PATHS.user.logout);
  });
});
