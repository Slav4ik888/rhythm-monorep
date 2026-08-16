// packages/frontend/src/features/user/model/store.test.ts
// Unit-тест стора features/user: serviceUpdateUser и serviceLogout.

import { useUserFeaturesStore } from './store';
import { userApi } from 'shared/api/features/user/api';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';
import type { PartialUser } from 'entities/user';

jest.mock('shared/api/features/user/api', () => ({
  userApi: { update: jest.fn(), logout: jest.fn() },
}));
jest.mock('shared/api/api', () => ({ api: {} }));
jest.mock('entities/user', () => ({
  useUserStore: { getState: jest.fn() },
}));
jest.mock('entities/company', () => ({
  useCompanyStore: { getState: jest.fn() },
}));
jest.mock('entities/ui', () => ({
  useUIStore: { getState: jest.fn() },
}));

describe('useUserFeaturesStore', () => {
  const userStoreState = { updateUser: jest.fn(), clearUser: jest.fn() };
  const companyStoreState = { setCompany: jest.fn() };
  const uiStoreState = { setSuccessMessage: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useUserFeaturesStore.setState({ loading: false, errors: {} });

    (useUserStore.getState as jest.Mock).mockReturnValue(userStoreState);
    (useCompanyStore.getState as jest.Mock).mockReturnValue(companyStoreState);
    (useUIStore.getState as jest.Mock).mockReturnValue(uiStoreState);
  });

  it('serviceUpdateUser обновляет пользователя и показывает сообщение об успехе', async () => {
    const userData = { companyId: 'c1', id: 'u1' } as PartialUser;
    (userApi.update as jest.Mock).mockResolvedValue(undefined);

    await useUserFeaturesStore.getState().serviceUpdateUser(userData);

    expect(userApi.update).toHaveBeenCalledTimes(1);
    expect(userStoreState.updateUser).toHaveBeenCalledWith(userData);
    expect(uiStoreState.setSuccessMessage).toHaveBeenCalledWith('Сохранено');
    expect(useUserFeaturesStore.getState().loading).toBe(false);
    expect(useUserFeaturesStore.getState().errors).toEqual({});
  });

  it('serviceUpdateUser записывает ошибку при неудачном запросе', async () => {
    const userData = { companyId: 'c1', id: 'u1' } as PartialUser;
    (userApi.update as jest.Mock).mockRejectedValue({
      response: { data: { general: 'Ошибка сервера' } },
    });

    await useUserFeaturesStore.getState().serviceUpdateUser(userData);

    expect(userStoreState.updateUser).not.toHaveBeenCalled();
    expect(useUserFeaturesStore.getState().loading).toBe(false);
    expect(useUserFeaturesStore.getState().errors).toEqual({ general: 'Ошибка сервера' });
  });

  it('serviceLogout очищает пользователя и компанию', async () => {
    (userApi.logout as jest.Mock).mockResolvedValue(undefined);

    await useUserFeaturesStore.getState().serviceLogout();

    expect(userApi.logout).toHaveBeenCalledTimes(1);
    expect(userStoreState.clearUser).toHaveBeenCalled();
    expect(companyStoreState.setCompany).toHaveBeenCalledWith({});
    expect(useUserFeaturesStore.getState().loading).toBe(false);
  });
});
