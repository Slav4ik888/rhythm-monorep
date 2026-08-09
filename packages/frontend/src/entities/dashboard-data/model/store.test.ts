// packages/frontend/src/entities/dashboard-data/model/store.test.ts
// Unit-тесты Zustand-стора dashboard-data

import { useDashboardDataStore } from './store';
import { LS } from 'shared/lib/local-storage';
import { PeriodType } from '../constants';
import * as utils from '../utils';
import type { DashboardPeriod } from '../types';
import type { StateSchemaDashboardData } from './slice/state-schema';

// Мокаем LS
jest.mock('shared/lib/local-storage', () => ({
  LS: {
    setDataState: jest.fn(),
    getDataState: jest.fn(),
  },
}));

// Мокаем утилиты
jest.mock('../utils', () => ({
  getEntitiesByPeriod: jest.fn((startEntities, startDates, period) => ({
    activeEntities: { ...startEntities },
    activeDates: { ...startDates },
  })),
  calculateStartDate: jest.fn((end, type) => 1000),
}));

// Мокаем getError
jest.mock('shared/lib/errors', () => ({
  getPayloadError: jest.fn((errors) => {
    if (!errors) return {};
    return errors;
  }),
}));

const mockState: StateSchemaDashboardData = {
  loading: false,
  errors: {},
  _isMounted: true,

  startEntities: {},
  startDates: {},
  lastUpdated: undefined,

  selectedPeriod: { type: PeriodType.NINE_MONTHS, start: undefined, end: undefined },
  activePeriod: { type: PeriodType.NINE_MONTHS, start: undefined, end: undefined },
  activeEntities: {},
  activeDates: {},
};

const emptyPeriod: DashboardPeriod = {
  type: PeriodType.NINE_MONTHS,
  start: undefined,
  end: undefined,
};

describe('useDashboardDataStore', () => {
  beforeEach(() => {
    useDashboardDataStore.setState({
      loading: false,
      errors: {},
      _isMounted: true,

      startEntities: {},
      startDates: {},
      lastUpdated: undefined,

      selectedPeriod: { ...emptyPeriod },
      activePeriod: { ...emptyPeriod },
      activeEntities: {},
      activeDates: {},
    });
    jest.clearAllMocks();
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useDashboardDataStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state._isMounted).toBe(true);
      expect(state.startEntities).toEqual({});
      expect(state.startDates).toEqual({});
      expect(state.lastUpdated).toBeUndefined();
      expect(state.activeEntities).toEqual({});
      expect(state.activeDates).toEqual({});
    });

    it('начальный selectedPeriod должен быть NINE_MONTHS с undefined start/end', () => {
      const state = useDashboardDataStore.getState();
      expect(state.selectedPeriod.type).toBe(PeriodType.NINE_MONTHS);
      expect(state.selectedPeriod.start).toBeUndefined();
      expect(state.selectedPeriod.end).toBeUndefined();
    });
  });

  describe('setInitial', () => {
    it('должен полностью заменить состояние', () => {
      const newState: StateSchemaDashboardData = {
        ...mockState,
        loading: true,
        lastUpdated: 1234567890,
        startEntities: { 'kod-1': { kod: 'kod-1' } as any },
      };

      useDashboardDataStore.getState().setInitial(newState);

      const state = useDashboardDataStore.getState();
      expect(state.loading).toBe(true);
      expect(state.lastUpdated).toBe(1234567890);
      expect(state.startEntities).toEqual(newState.startEntities);
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Тестовая ошибка' };
      useDashboardDataStore.getState().setErrors(errors);
      expect(useDashboardDataStore.getState().errors).toEqual(errors);
    });

    it('должен установить пустые errors если передано undefined', () => {
      useDashboardDataStore.getState().setErrors(undefined);
      expect(useDashboardDataStore.getState().errors).toEqual({});
    });
  });

  describe('clearErrors', () => {
    it('должен очистить errors', () => {
      useDashboardDataStore.setState({ errors: { general: 'Ошибка' } });
      useDashboardDataStore.getState().clearErrors();
      expect(useDashboardDataStore.getState().errors).toEqual({});
    });
  });

  describe('setActivePeriod', () => {
    it('должен обновить activePeriod, пересчитать activeEntities/activeDates и сохранить в LS', () => {
      useDashboardDataStore.getState().setActivePeriod({
        companyId: 'company-1',
        period: { type: PeriodType.ONE_MONTH, start: undefined, end: undefined },
      });

      const state = useDashboardDataStore.getState();
      expect(state.activePeriod.type).toBe(PeriodType.ONE_MONTH);
      expect(utils.getEntitiesByPeriod).toHaveBeenCalled();
      expect(LS.setDataState).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({
          activePeriod: expect.objectContaining({ type: PeriodType.ONE_MONTH }),
        }),
      );
    });
  });

  describe('setSelectedPeriod', () => {
    it('должен обновить selectedPeriod и activePeriod, пересчитать сущности и сохранить в LS', () => {
      useDashboardDataStore.getState().setSelectedPeriod({
        companyId: 'company-1',
        period: { type: PeriodType.THREE_MONTHS },
      });

      const state = useDashboardDataStore.getState();
      expect(state.selectedPeriod.type).toBe(PeriodType.THREE_MONTHS);
      expect(state.activePeriod.type).toBe(PeriodType.THREE_MONTHS);
      expect(state.activePeriod.start).toBe(1000); // calculateStartDate вернул 1000
      expect(state.selectedPeriod.start).toBe(1000);
      expect(utils.calculateStartDate).toHaveBeenCalled();
      expect(utils.getEntitiesByPeriod).toHaveBeenCalled();
      expect(LS.getDataState).toHaveBeenCalledWith('company-1');
      expect(LS.setDataState).toHaveBeenCalledWith('company-1', expect.any(Object));
    });

    it('при CUSTOM и dateType=start должен установить start из period.start', () => {
      useDashboardDataStore.getState().setSelectedPeriod({
        companyId: 'company-1',
        dateType: 'start',
        period: { type: PeriodType.CUSTOM, start: 5555 },
      });

      const state = useDashboardDataStore.getState();
      expect(state.activePeriod.start).toBe(5555);
      expect(state.selectedPeriod.start).toBe(5555);
    });

    it('при CUSTOM и dateType=end должен использовать selectedPeriod.start', () => {
      // Устанавливаем selectedPeriod.start
      useDashboardDataStore.setState({
        selectedPeriod: { type: PeriodType.CUSTOM, start: 9999, end: undefined },
      });

      useDashboardDataStore.getState().setSelectedPeriod({
        companyId: 'company-1',
        dateType: 'end',
        period: { type: PeriodType.CUSTOM, end: 8888 },
      });

      const state = useDashboardDataStore.getState();
      expect(state.activePeriod.start).toBe(9999);
      expect(state.selectedPeriod.start).toBe(9999);
    });

    it('не должен перезатирать все данные при сохранении в LS (use oldData)', () => {
      const oldData = { someField: 'value' } as any;
      (LS.getDataState as jest.Mock).mockReturnValueOnce(oldData);

      useDashboardDataStore.getState().setSelectedPeriod({
        companyId: 'company-1',
        period: { type: PeriodType.ONE_YEAR },
      });

      expect(LS.setDataState).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({
          ...oldData,
          activePeriod: expect.any(Object),
          selectedPeriod: expect.any(Object),
        }),
      );
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useDashboardDataStore.setState({ errors: { old: 'error' } });
      useDashboardDataStore.getState().startLoading();

      const state = useDashboardDataStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishGetData', () => {
    it('должен сохранить startEntities/startDates, lastUpdated, пересчитать активные и сохранить в LS', () => {
      const before = Date.now();

      useDashboardDataStore.getState().finishGetData({
        companyId: 'company-1',
        startEntities: { 'kod-1': { kod: 'kod-1' } as any },
        startDates: { month: [1, 2, 3] },
      });

      const state = useDashboardDataStore.getState();
      expect(state.startEntities).toEqual({ 'kod-1': { kod: 'kod-1' } as any });
      expect(state.startDates).toEqual({ month: [1, 2, 3] });
      expect(state.lastUpdated).toBeGreaterThanOrEqual(before);
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(utils.getEntitiesByPeriod).toHaveBeenCalled();
      expect(LS.setDataState).toHaveBeenCalledWith(
        'company-1',
        expect.objectContaining({
          startEntities: { 'kod-1': { kod: 'kod-1' } as any },
          startDates: { month: [1, 2, 3] },
          loading: false,
          errors: {},
        }),
      );
    });
  });

  describe('failGetData', () => {
    it('должен установить errors и сбросить loading', () => {
      useDashboardDataStore.setState({ loading: true });
      useDashboardDataStore.getState().failGetData({ general: 'Ошибка загрузки' });

      const state = useDashboardDataStore.getState();
      expect(state.errors).toEqual({ general: 'Ошибка загрузки' });
      expect(state.loading).toBe(false);
    });

    it('должен установить пустые errors если передан undefined', () => {
      useDashboardDataStore.setState({ loading: true });
      useDashboardDataStore.getState().failGetData(undefined);

      expect(useDashboardDataStore.getState().errors).toEqual({});
      expect(useDashboardDataStore.getState().loading).toBe(false);
    });
  });
});
