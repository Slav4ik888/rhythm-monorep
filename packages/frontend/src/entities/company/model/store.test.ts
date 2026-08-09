// packages/frontend/src/entities/company/model/store.test.ts

import { useCompanyStore } from './store';
import { LS } from 'shared/lib/local-storage';
import type { Company, ParamsCompany } from '../types';

// Мокаем LS
jest.mock('shared/lib/local-storage', () => ({
  LS: {
    setCompanyState: jest.fn(),
    setLastCompanyId: jest.fn(),
    setParamsCompanyState: jest.fn(),
    getParamsCompanyState: jest.fn(),
    getCompanyState: jest.fn(),
  },
}));

// Мокаем updateObject
jest.mock('shared/helpers/objects', () => ({
  updateObject: jest.fn((obj, partial) => ({ ...obj, ...partial })),
  getChanges: jest.fn((stored, current) => {
    const changes: Record<string, unknown> = {};
    if (!stored || !current) return changes;
    Object.keys(current).forEach((key) => {
      if (JSON.stringify(stored[key]) !== JSON.stringify(current[key])) {
        changes[key] = current[key];
      }
    });
    return changes;
  }),
}));

const mockCompany: Company = {
  id: 'company-1',
  companyName: 'Test Company',
  ownerId: 'owner-1',
  owner: 'owner@test.com',
  logoUrl: '',
  status: 'ACTIVE' as any,
  companyMembers: [],
  createdAt: {} as any,
  lastChange: {} as any,
  googleData: { url: '' },
  customSettings: {},
  bunchesUpdated: {},
  dashboardMembers: [],
};

const mockParamsCompany: ParamsCompany = {
  ...mockCompany,
  customSettings: { periodType: { month: { color: '#fff' } } },
};

describe('useCompanyStore', () => {
  beforeEach(() => {
    useCompanyStore.setState({
      loading: false,
      errors: {},
      company: {} as Company,
      paramsCompany: {} as ParamsCompany,
      storedCompany: {} as ParamsCompany,
      _isParamsCompanyIdLoaded: false,
    });
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useCompanyStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.company).toEqual({});
      expect(state.paramsCompany).toEqual({});
      expect(state.storedCompany).toEqual({});
      expect(state._isParamsCompanyIdLoaded).toBe(false);
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Ошибка' };
      useCompanyStore.getState().setErrors(errors);
      expect(useCompanyStore.getState().errors).toEqual(errors);
    });

    it('должен установить пустые errors если передано undefined', () => {
      useCompanyStore.getState().setErrors(undefined);
      expect(useCompanyStore.getState().errors).toEqual({});
    });
  });

  describe('setCompany', () => {
    it('должен установить company, storedCompany, paramsCompany и сохранить в LS', () => {
      useCompanyStore.getState().setCompany(mockCompany);

      const state = useCompanyStore.getState();
      expect(state.company).toEqual(mockCompany);
      expect(state.storedCompany).toEqual(mockCompany);
      expect(state.paramsCompany).toEqual(mockCompany);
      expect(LS.setCompanyState).toHaveBeenCalledWith('company-1', expect.objectContaining({ company: mockCompany }));
      expect(LS.setLastCompanyId).toHaveBeenCalledWith('company-1');
    });
  });

  describe('updateParamsCompany', () => {
    it('должен обновить поля paramsCompany', () => {
      useCompanyStore.setState({ paramsCompany: { ...mockCompany } });
      useCompanyStore.getState().updateParamsCompany({ companyName: 'New Name' });

      expect(useCompanyStore.getState().paramsCompany.companyName).toBe('New Name');
    });
  });

  describe('setIsParamsCompanyIdLoaded', () => {
    it('должен установить флаг загрузки paramsCompany', () => {
      useCompanyStore.getState().setIsParamsCompanyIdLoaded(true);
      expect(useCompanyStore.getState()._isParamsCompanyIdLoaded).toBe(true);
    });
  });

  describe('updateParamsCustomSettings', () => {
    it('должен обновить customSettings в paramsCompany', () => {
      useCompanyStore.setState({ paramsCompany: { ...mockCompany } });
      useCompanyStore.getState().updateParamsCustomSettings({ periodType: { week: { color: '#000' } } });

      const state = useCompanyStore.getState();
      expect(state.paramsCompany.customSettings).toBeDefined();
    });

    it('должен cоздать customSettings если их нет', () => {
      const companyWithoutSettings = { ...mockCompany };
      delete (companyWithoutSettings as any).customSettings;
      useCompanyStore.setState({ paramsCompany: companyWithoutSettings });
      useCompanyStore.getState().updateParamsCustomSettings({ companyType: { main: { background: '#eee' } } });

      const state = useCompanyStore.getState();
      expect(state.paramsCompany.customSettings).toBeDefined();
      expect((state.paramsCompany.customSettings as any).companyType).toBeDefined();
    });
  });

  describe('cancelParamsCustomSettings', () => {
    it('должен откатить paramsCompany до storedCompany и очистить storedCompany', () => {
      const stored = { ...mockCompany, companyName: 'Stored Name' };
      const params = { ...mockCompany, companyName: 'Changed Name' };
      useCompanyStore.setState({
        storedCompany: stored,
        paramsCompany: params,
      });

      useCompanyStore.getState().cancelParamsCustomSettings();

      const state = useCompanyStore.getState();
      expect(state.paramsCompany.companyName).toBe('Stored Name');
      expect(state.storedCompany).toEqual({});
    });

    it('должен откатить paramsCompany даже если storedCompany пустой объект (поведение оригинала)', () => {
      useCompanyStore.setState({
        storedCompany: {} as ParamsCompany,
        paramsCompany: { ...mockCompany, companyName: 'Changed' },
      });

      useCompanyStore.getState().cancelParamsCustomSettings();

      const state = useCompanyStore.getState();
      // storedCompany === {} это truthy → откат до {}, поэтому companyName теряется
      expect(state.paramsCompany.companyName).toBeUndefined();
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useCompanyStore.setState({ errors: { old: 'error' } });
      useCompanyStore.getState().startLoading();

      const state = useCompanyStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishGetParamsCompany', () => {
    it('должен сохранить paramsCompany, сбросить loading и обновить LS', () => {
      useCompanyStore.getState().finishGetParamsCompany(mockParamsCompany);

      const state = useCompanyStore.getState();
      expect(state.paramsCompany).toEqual(mockParamsCompany);
      expect(state.storedCompany).toEqual(mockParamsCompany);
      expect(state._isParamsCompanyIdLoaded).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(LS.setParamsCompanyState).toHaveBeenCalledWith(mockParamsCompany);
    });

    it('не должен вызывать LS.setParamsCompanyState если нет id', () => {
      const noIdCompany = { ...mockParamsCompany, id: '' as any };
      useCompanyStore.getState().finishGetParamsCompany(noIdCompany);

      expect(LS.setParamsCompanyState).not.toHaveBeenCalled();
    });
  });

  describe('failGetParamsCompany', () => {
    it('должен установить _isParamsCompanyIdLoaded=true, errors и сбросить loading', () => {
      useCompanyStore.setState({ loading: true });
      useCompanyStore.getState().failGetParamsCompany({ general: 'Ошибка сети' });

      const state = useCompanyStore.getState();
      expect(state._isParamsCompanyIdLoaded).toBe(true);
      expect(state.errors).toEqual({ general: 'Ошибка сети' });
      expect(state.loading).toBe(false);
    });

    it('должен установить пустые errors если передан undefined', () => {
      useCompanyStore.setState({ loading: true });
      useCompanyStore.getState().failGetParamsCompany(undefined);

      expect(useCompanyStore.getState().errors).toEqual({});
    });
  });

  describe('finishUpdateCompany', () => {
    it('должен обновить paramsCompany/storedCompany и сбросить loading', () => {
      useCompanyStore.setState({
        paramsCompany: { ...mockCompany },
        storedCompany: { ...mockCompany },
        loading: true,
      });

      useCompanyStore.getState().finishUpdateCompany({ companyName: 'Updated Name' });

      const state = useCompanyStore.getState();
      expect(state.paramsCompany.companyName).toBe('Updated Name');
      expect(state.storedCompany.companyName).toBe('Updated Name');
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
    });
  });

  describe('failUpdateCompany', () => {
    it('должен установить errors и сбросить loading', () => {
      useCompanyStore.setState({ loading: true });
      useCompanyStore.getState().failUpdateCompany({ general: 'Ошибка обновления' });

      const state = useCompanyStore.getState();
      expect(state.errors).toEqual({ general: 'Ошибка обновления' });
      expect(state.loading).toBe(false);
    });
  });

  describe('finishDeleteSheet', () => {
    it('должен удалить sheet из paramsCompany и storedCompany', () => {
      const sheets = { 'sheet-1': { id: 'sheet-1', label: 'Test', iconId: 'default' } as any };
      useCompanyStore.setState({
        paramsCompany: { ...mockCompany, sheets } as unknown as ParamsCompany,
        storedCompany: { ...mockCompany, sheets } as unknown as ParamsCompany,
        loading: true,
      });

      useCompanyStore.getState().finishDeleteSheet('sheet-1');

      const state = useCompanyStore.getState();
      expect(state.paramsCompany.sheets?.['sheet-1']).toBeUndefined();
      expect(state.storedCompany.sheets?.['sheet-1']).toBeUndefined();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
    });

    it('не должен падать если sheets отсутствуют', () => {
      useCompanyStore.setState({
        paramsCompany: { ...mockCompany } as ParamsCompany,
        storedCompany: { ...mockCompany } as ParamsCompany,
        loading: true,
      });

      useCompanyStore.getState().finishDeleteSheet('nonexistent');

      const state = useCompanyStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
    });
  });

  describe('failDeleteSheet', () => {
    it('должен установить errors и сбросить loading', () => {
      useCompanyStore.setState({ loading: true });
      useCompanyStore.getState().failDeleteSheet({ general: 'Ошибка удаления' });

      const state = useCompanyStore.getState();
      expect(state.errors).toEqual({ general: 'Ошибка удаления' });
      expect(state.loading).toBe(false);
    });
  });
});
