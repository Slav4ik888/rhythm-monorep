// packages/frontend/src/entities/dashboard-data/model/store.ts
// Zustand-стор для управления данными дашборда (периоды, сущности)
// Мигрировано с Redux (slice/index.ts + extraReducers getData)

import { create } from 'zustand';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import type { DashboardPeriod } from '../types';
import { PeriodType } from '../constants';
import { getEntitiesByPeriod, calculateStartDate } from '../utils';
import type { StateSchemaDashboardData, SetActivePeriod, SetSelectedPeriod } from './state-schema';

const emptyPeriod: DashboardPeriod = {
  type: PeriodType.NINE_MONTHS,
  start: undefined,
  end: undefined,
};

const initialState: StateSchemaDashboardData = {
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
};

interface DashboardDataActions {
  // Синхронные действия (аналоги Redux reducers)
  setInitial: (state: StateSchemaDashboardData) => void;
  setErrors: (errors?: Errors) => void;
  clearErrors: () => void;
  setActivePeriod: (data: SetActivePeriod) => void;
  setSelectedPeriod: (data: SetSelectedPeriod) => void;

  // Асинхронные действия (заменяют extraReducers для getData)
  startLoading: () => void;
  finishGetData: (payload: {
    companyId: string;
    startEntities: StateSchemaDashboardData['startEntities'];
    startDates: StateSchemaDashboardData['startDates'];
  }) => void;
  failGetData: (errors?: Errors) => void;
}

export type DashboardDataStore = StateSchemaDashboardData & DashboardDataActions;

export const useDashboardDataStore = create<DashboardDataStore>((set) => ({
  ...initialState,

  setInitial: (payload) => set(() => ({ ...payload })),

  setErrors: (errors) => set({ errors: getError(errors) }),

  clearErrors: () => set({ errors: {} }),

  setActivePeriod: ({ companyId, period }) =>
    set((state) => {
      const activePeriod = {
        ...state.activePeriod,
        ...period,
      };

      const { activeDates, activeEntities } = getEntitiesByPeriod(state.startEntities, state.startDates, activePeriod);

      LS.setDataState(companyId, {
        ...state,
        activePeriod,
        activeEntities,
        activeDates,
      });

      return {
        activePeriod,
        activeEntities,
        activeDates,
      };
    }),

  setSelectedPeriod: ({ companyId, dateType, period }) =>
    set((state) => {
      const type = period.type || state.selectedPeriod.type || PeriodType.NINE_MONTHS;
      const isCustomPeriod = type === PeriodType.CUSTOM;
      const isStartDate = dateType === 'start';

      const calcedStartDate = isCustomPeriod
        ? isStartDate
          ? period.start
          : state.selectedPeriod.start
        : calculateStartDate(state.selectedPeriod.end, type);

      const activePeriod = {
        ...state.activePeriod,
        ...period,
        start: calcedStartDate,
      };

      const selectedPeriod = {
        ...state.selectedPeriod,
        ...period,
        start: calcedStartDate,
      };

      const { activeDates, activeEntities } = getEntitiesByPeriod(state.startEntities, state.startDates, activePeriod);

      // Тк при первом запуске setSelectedPeriod вызывается автоматически, поэтому нужно НЕ затереть имеющиеся данные
      // TODO: перепроверить, возможно это уже надо убрать
      const oldData = LS.getDataState(companyId) || ({} as StateSchemaDashboardData);
      LS.setDataState(companyId, {
        ...oldData,
        activePeriod,
        selectedPeriod,
      });

      return {
        activePeriod,
        selectedPeriod,
        activeEntities,
        activeDates,
      };
    }),

  // Асинхронные действия (заменяют extraReducers)
  startLoading: () => set({ loading: true, errors: {} }),

  finishGetData: ({ companyId, startEntities, startDates }) =>
    set((state) => {
      const { activeDates, activeEntities } = getEntitiesByPeriod(startEntities, startDates, state.activePeriod);

      const newState = {
        startEntities,
        startDates,
        lastUpdated: new Date().getTime(),
        activeEntities,
        activeDates,
        loading: false,
        errors: {},
      };

      LS.setDataState(companyId, {
        ...state,
        ...newState,
      });

      return newState;
    }),

  failGetData: (errors) =>
    set({
      errors: getError(errors),
      loading: false,
    }),
}));
