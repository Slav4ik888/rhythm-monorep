// packages/frontend/src/entities/dashboard-data/model/hooks/use-dashboard-data/index.ts
// Переписан с Redux (useSelector/useDispatch) на Zustand (useDashboardDataStore)
// Миграция Redux → Zustand

import { useDashboardDataStore } from '../../store';
import { Errors } from 'shared/lib/validators';
import type { StateSchemaDashboardData, SetActivePeriod, SetSelectedPeriod } from '../../state-schema';
import { useMemo } from 'react';
import { sortingArr } from 'shared/helpers/sorting';

interface Config {
  kod?: string;
}

export const useDashboardData = (config: Config = {}) => {
  const { kod } = config;

  const loading = useDashboardDataStore((s) => s.loading);
  const errors = useDashboardDataStore((s) => s.errors);
  const isMounted = useDashboardDataStore((s) => s._isMounted);

  const startEntities = useDashboardDataStore((s) => s.startEntities);
  const startDates = useDashboardDataStore((s) => s.startDates);

  const kods = useMemo(
    () =>
      sortingArr(
        Object.values(startEntities).map((entity) => ({
          value: entity.kod,
          title: entity.title,
          company: entity.companyType,
          product: entity.productType,
          period: entity.periodType,
        })),
        'value',
      ),
    [startEntities],
  );

  const itemByKod = useMemo(() => startEntities[kod || ''] || '', [startEntities, kod]);

  const activeEntities = useDashboardDataStore((s) => s.activeEntities);
  const activeDates = useDashboardDataStore((s) => s.activeDates);

  const lastUpdated = useDashboardDataStore((s) => s.lastUpdated);

  const activePeriod = useDashboardDataStore((s) => s.activePeriod);
  const activePeriodType = activePeriod?.type;
  const activeDateStart = activePeriod?.start;
  const activeDateEnd = activePeriod?.end;

  const selectedPeriod = useDashboardDataStore((s) => s.selectedPeriod);
  const selectedPeriodType = selectedPeriod?.type;
  const selectedDateStart = selectedPeriod?.start;
  const selectedDateEnd = selectedPeriod?.end;

  const api = useMemo(
    () => ({
      setErrors: (errors: Errors) => useDashboardDataStore.getState().setErrors(errors),
      clearErrors: () => useDashboardDataStore.getState().clearErrors(),
      setInitial: (state: StateSchemaDashboardData) => useDashboardDataStore.getState().setInitial(state),
      setActivePeriod: (data: SetActivePeriod) => useDashboardDataStore.getState().setActivePeriod(data),
      setSelectedPeriod: (data: SetSelectedPeriod) => useDashboardDataStore.getState().setSelectedPeriod(data),
    }),
    [],
  );

  return {
    loading,
    errors,
    isMounted,

    startEntities,
    startDates,
    kods,
    itemByKod,

    activeEntities,
    activeDates,

    lastUpdated,

    activePeriod,
    activePeriodType,
    activeDateStart,
    activeDateEnd,

    selectedPeriod,
    selectedPeriodType,
    selectedDateStart,
    selectedDateEnd,

    ...api,
  };
};
