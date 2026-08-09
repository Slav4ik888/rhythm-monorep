// packages/frontend/src/entities/transactions/model/store.spec.ts

import { useTransactionsStore } from './store';

describe('useTransactionsStore', () => {
  beforeEach(() => {
    useTransactionsStore.setState({
      loading: false,
      errors: {},
    });
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useTransactionsStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Ошибка транзакции' };
      useTransactionsStore.getState().setErrors(errors);
      expect(useTransactionsStore.getState().errors).toEqual(errors);
    });

    it('должен обработать пустой объект ошибок', () => {
      useTransactionsStore.getState().setErrors({});
      expect(useTransactionsStore.getState().errors).toEqual({});
    });
  });

  describe('clearErrors', () => {
    it('должен очистить ошибки', () => {
      useTransactionsStore.getState().setErrors({ general: 'test' });
      useTransactionsStore.getState().clearErrors();
      expect(useTransactionsStore.getState().errors).toEqual({});
    });
  });

  describe('setLoading', () => {
    it('должен установить loading=true', () => {
      useTransactionsStore.getState().setLoading(true);
      expect(useTransactionsStore.getState().loading).toBe(true);
    });

    it('должен установить loading=false', () => {
      useTransactionsStore.getState().setLoading(true);
      useTransactionsStore.getState().setLoading(false);
      expect(useTransactionsStore.getState().loading).toBe(false);
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useTransactionsStore.getState().setErrors({ old: 'error' });
      useTransactionsStore.getState().startLoading();
      const state = useTransactionsStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishLoading', () => {
    it('должен сбросить loading', () => {
      useTransactionsStore.getState().startLoading();
      useTransactionsStore.getState().finishLoading();
      expect(useTransactionsStore.getState().loading).toBe(false);
    });
  });
});
