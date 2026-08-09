// packages/frontend/src/entities/dashboard-data/model/state-schema.ts

import type { DashboardPeriod, DashboardStatisticItem } from '../types';
import type { Errors } from 'shared/lib/validators';

/** Нормализованные сущности данных: { [entityId: string]: DashboardStatisticItem } */
export interface DashboardDataEntities {
  [entityId: string]: DashboardStatisticItem;
}

export interface DashboardDataDates {
  [entityId: string]: number[];
}

export interface StateSchemaDashboardData {
  loading: boolean;
  errors: Errors;
  _isMounted: boolean;

  startEntities: DashboardDataEntities;
  startDates: DashboardDataDates;
  lastUpdated: number | undefined;

  selectedPeriod: DashboardPeriod;
  activePeriod: DashboardPeriod;
  activeEntities: DashboardDataEntities;
  activeDates: DashboardDataDates;
}

export interface SetActivePeriod {
  companyId: string;
  period: Partial<DashboardPeriod>;
}

export interface SetSelectedPeriod {
  companyId: string;
  dateType?: 'start' | 'end';
  period: Partial<DashboardPeriod>;
}
