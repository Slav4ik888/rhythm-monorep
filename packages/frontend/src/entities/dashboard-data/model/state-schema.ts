// packages/frontend/src/entities/dashboard-data/model/state-schema.ts

import type { DashboardPeriod } from '../types';
import type { Errors } from 'shared/lib/validators';

export interface DashboardDataEntities {
  [entityId: string]: any[];
}

export interface DashboardDataDates {
  [entityId: string]: string[];
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
  dateType: 'start' | 'end';
  period: Partial<DashboardPeriod>;
}
