// packages/frontend/src/entities/user/model/store.test.ts

import { useUserStore } from './store';
import { LS } from 'shared/lib/local-storage';

// Мокаем LS, чтобы тесты не зависели от localStorage
jest.mock('shared/lib/local-storage', () => ({
  LS: {
    setUserState: jest.fn(),
  },
}));

// Мокаем creatorUser
jest.mock('../lib/creators', () => ({
  creatorUser: jest.fn((user) => user),
}));

// Мокаем updateObject
jest.mock('shared/helpers/objects', () => ({
  updateObject: jest.fn((obj, partial) => ({ ...obj, ...partial })),
}));

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({
      _isLoaded: false,
      loading: false,
      errors: {},
      auth: false,
      user: {} as any,
    });
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useUserStore.getState();
      expect(state._isLoaded).toBe(false);
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.auth).toBe(false);
      expect(state.user).toEqual({});
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Ошибка' };
      useUserStore.getState().setErrors(errors);
      expect(useUserStore.getState().errors).toEqual(errors);
    });
  });

  describe('clearErrors', () => {
    it('должен очистить ошибки', () => {
      useUserStore.getState().setErrors({ general: 'test' });
      useUserStore.getState().clearErrors();
      expect(useUserStore.getState().errors).toEqual({});
    });
  });

  describe('setAuth', () => {
    it('должен установить auth=true', () => {
      useUserStore.getState().setAuth(true);
      expect(useUserStore.getState().auth).toBe(true);
    });

    it('должен установить auth=false', () => {
      useUserStore.getState().setAuth(false);
      expect(useUserStore.getState().auth).toBe(false);
    });
  });

  describe('setUser', () => {
    it('должен установить пользователя, auth=true и сохранить в LS', () => {
      const user = { id: '123', email: 'test@test.com' } as any;
      useUserStore.getState().setUser('company-1', user);

      const state = useUserStore.getState();
      expect(state.auth).toBe(true);
      expect(state.user).toEqual(user);
      expect((LS as jest.Mocked<typeof LS>).setUserState).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({ auth: true }),
      );
    });
  });

  describe('updateUser', () => {
    it('должен обновить поля пользователя и очистить errors/loading', () => {
      useUserStore.setState({
        user: { id: '123', email: 'old@test.com' } as any,
        errors: { general: 'old' },
        loading: true,
      });

      useUserStore.getState().updateUser({ email: 'new@test.com' } as any);

      const state = useUserStore.getState();
      expect(state.user.email).toBe('new@test.com');
      expect(state.errors).toEqual({});
      expect(state.loading).toBe(false);
    });
  });

  describe('clearUser', () => {
    it('должен сбросить auth, user и errors', () => {
      useUserStore.setState({
        auth: true,
        user: { id: '123' } as any,
        errors: { general: 'error' },
      });

      useUserStore.getState().clearUser();

      const state = useUserStore.getState();
      expect(state.auth).toBe(false);
      expect(state.user).toEqual({});
      expect(state.errors).toEqual({});
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useUserStore.getState().setErrors({ old: 'error' });
      useUserStore.getState().startLoading();

      const state = useUserStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishGetAuth', () => {
    it('должен установить auth=true, _isLoaded=true, user и сохранить в LS', () => {
      const user = { id: '123', email: 'test@test.com' } as any;

      useUserStore.getState().finishGetAuth('company-1', user);

      const state = useUserStore.getState();
      expect(state.auth).toBe(true);
      expect(state._isLoaded).toBe(true);
      expect(state.user).toEqual(user);
      expect(state.errors).toEqual({});
      expect(state.loading).toBe(false);
      expect((LS as jest.Mocked<typeof LS>).setUserState).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({ auth: true, _isLoaded: true }),
      );
    });
  });

  describe('failGetAuth', () => {
    it('должен установить _isLoaded=true, errors и сбросить loading', () => {
      useUserStore.setState({ loading: true });

      useUserStore.getState().failGetAuth({ general: 'Ошибка сети' });

      const state = useUserStore.getState();
      expect(state._isLoaded).toBe(true);
      expect(state.errors).toEqual({ general: 'Ошибка сети' });
      expect(state.loading).toBe(false);
    });

    it('должен установить пустые errors если передан undefined', () => {
      useUserStore.setState({ loading: true });

      useUserStore.getState().failGetAuth(undefined as any);

      const state = useUserStore.getState();
      expect(state._isLoaded).toBe(true);
      expect(state.errors).toEqual({});
      expect(state.loading).toBe(false);
    });
  });
});
