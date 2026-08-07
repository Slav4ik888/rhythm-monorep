import { createSelector } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers/store';
import { sortingArr } from 'shared/helpers/sorting';
import { StateSchemaDashboardData as SSDD, DashboardDataEntities } from '../slice/state-schema';



export const selectModule = createSelector([(state: StateSchema) =>
  state.dashboardData || {} as SSDD], (state: SSDD) => state);

export const selectLoading   = createSelector(selectModule, (state: SSDD) => state.loading);
export const selectErrors    = createSelector(selectModule, (state: SSDD) => state.errors);
export const selectIsMounted = createSelector(selectModule, (state: SSDD) => state._isMounted);

export const selectStartEntities = createSelector(selectModule, (state: SSDD) => state.startEntities || {});
export const selectStartDates = createSelector(selectModule, (state: SSDD) => state.startDates || {});

/** Returns sorted list of all kods */
export const selectKods = createSelector(
  selectStartEntities,
  (startEntities: DashboardDataEntities) => sortingArr(
    Object.values(startEntities).map(entity => ({
      value   : entity.kod, // value тк в SelectValue используется value
      title   : entity.title,
      company : entity.companyType,
      product : entity.productType,
      period  : entity.periodType,
    })),
    'value'
  )
);

/** Returns StatisticItem by kod */
export const makeSelectItemByKod = (kod: string | undefined) => createSelector(
  [selectStartEntities],
  (startEntities: DashboardDataEntities) => startEntities[kod || ''] || ''
);

export const selectLastUpdated    = createSelector(selectModule, (state: SSDD) => state.lastUpdated);


export const selectActivePeriod   = createSelector(selectModule, (state: SSDD) => state.activePeriod || {});
export const selectSelectedPeriod = createSelector(selectModule, (state: SSDD) => state.selectedPeriod || {});

export const selectActiveEntities = createSelector(selectModule, (state: SSDD) => state.activeEntities || {});
export const selectActiveDates    = createSelector(selectModule, (state: SSDD) => state.activeDates || {});
