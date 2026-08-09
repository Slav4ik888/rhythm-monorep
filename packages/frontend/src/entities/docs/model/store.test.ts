// packages/frontend/src/entities/docs/model/store.spec.ts

import { useDocsStore } from './store';

describe('useDocsStore', () => {
  beforeEach(() => {
    useDocsStore.setState({
      loading: false,
      errors: {},
      docKeys: {} as never,
    });
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useDocsStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.docKeys).toEqual({});
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Ошибка загрузки документа' };
      useDocsStore.getState().setErrors(errors);
      expect(useDocsStore.getState().errors).toEqual(errors);
    });

    it('должен обработать пустой объект ошибок', () => {
      useDocsStore.getState().setErrors({});
      expect(useDocsStore.getState().errors).toEqual({});
    });
  });

  describe('clearErrors', () => {
    it('должен очистить ошибки', () => {
      useDocsStore.getState().setErrors({ general: 'test' });
      useDocsStore.getState().clearErrors();
      expect(useDocsStore.getState().errors).toEqual({});
    });
  });

  describe('setLoading', () => {
    it('должен установить loading=true', () => {
      useDocsStore.getState().setLoading(true);
      expect(useDocsStore.getState().loading).toBe(true);
    });

    it('должен установить loading=false', () => {
      useDocsStore.getState().setLoading(true);
      useDocsStore.getState().setLoading(false);
      expect(useDocsStore.getState().loading).toBe(false);
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useDocsStore.getState().setErrors({ old: 'error' });
      useDocsStore.getState().startLoading();
      const state = useDocsStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishLoading', () => {
    it('должен сбросить loading', () => {
      useDocsStore.getState().startLoading();
      useDocsStore.getState().finishLoading();
      expect(useDocsStore.getState().loading).toBe(false);
    });
  });

  describe('setDocKey', () => {
    it('должен установить значение для ключа policy', () => {
      useDocsStore.getState().setDocKey('policy', '# Политика');
      expect(useDocsStore.getState().docKeys.policy).toBe('# Политика');
    });

    it('должен перезаписать значение для ключа policy', () => {
      useDocsStore.getState().setDocKey('policy', '# Старая');
      useDocsStore.getState().setDocKey('policy', '# Новая');
      expect(useDocsStore.getState().docKeys.policy).toBe('# Новая');
    });
  });
});
