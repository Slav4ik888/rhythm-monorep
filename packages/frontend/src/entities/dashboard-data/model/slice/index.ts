import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { DashboardPeriod } from '../../types';
import { getPayloadError as getError } from 'shared/lib/errors';
import { PeriodType } from '../../constants';
import { getEntitiesByPeriod, calculateStartDate } from '../../utils';
import { StateSchemaDashboardData } from './state-schema';
import { getData } from 'features/dashboard-data';
import { SetActivePeriod, SetSelectedPeriod } from './types';
import { ResGetGoogleData } from 'shared/types';



// TODO: validate dates data (проверить даты на упорядоченность и на то, что дата, является датой)

const emptyPeriod: DashboardPeriod = {
  type  : PeriodType.NINE_MONTHS,
  start : undefined,
  end   : undefined, // new Date().getTime()
};


const initialState: StateSchemaDashboardData = {
  loading        : false,
  errors         : {},
  _isMounted     : true,

  startEntities  : {},
  startDates     : {},
  lastUpdated    : undefined,

  selectedPeriod : { ...emptyPeriod },
  activePeriod   : { ...emptyPeriod },
  activeEntities : {},
  activeDates    : {},
};


export const slice = createSlice({
  name: 'entities/dashboardData',
  initialState,
  reducers: {
    setInitial: (state, { payload }: PayloadAction<StateSchemaDashboardData>) => {
      state.startEntities  = payload.startEntities;
      state.startDates     = payload.startDates;
      state.lastUpdated    = payload.lastUpdated;

      state.selectedPeriod = payload.selectedPeriod;
      state.activePeriod   = payload.activePeriod;
      state.activeEntities = payload.activeEntities;
      state.activeDates    = payload.activeDates;

      state.loading        = payload.loading;
      state.errors         = payload.errors;
    },
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },

    setActivePeriod: (state, { payload }: PayloadAction<SetActivePeriod>) => {
      state.activePeriod = {
        ...state.activePeriod,
        ...payload.period
      };

      const { activeDates, activeEntities } = getEntitiesByPeriod(
        state.startEntities,
        state.startDates,
        state.activePeriod
      );
      state.activeEntities = activeEntities;
      state.activeDates    = activeDates;

      LS.setDataState(payload.companyId, state); // Save state to local storage
    },
    setSelectedPeriod: (state, { payload }: PayloadAction<SetSelectedPeriod>) => {
      const type = payload.period.type || state.selectedPeriod.type || PeriodType.NINE_MONTHS;
      const isCustomPeriod = type === PeriodType.CUSTOM;
      const isStartDate = payload.dateType === 'start';

      const calcedStartDate = isCustomPeriod
        ? isStartDate ? payload.period.start : state.selectedPeriod.start
        : calculateStartDate(state.selectedPeriod.end, type);

      state.activePeriod = {
        ...state.activePeriod,
        ...payload.period,
        start: calcedStartDate
      };

      state.selectedPeriod = {
        ...state.selectedPeriod,
        ...payload.period,
        start: calcedStartDate
      };

      const { activeDates, activeEntities } = getEntitiesByPeriod(
        state.startEntities,
        state.startDates,
        state.activePeriod
      );
      state.activeEntities = activeEntities;
      state.activeDates    = activeDates;

      // Тк при первом запуске setSelectedPeriod вызывается автоматически, поэтому нужно НЕ затереть имеющиеся данные
      // TODO: перепроверить, возможно это уже надо убрать
      const oldData = LS.getDataState(payload.companyId) || {} as StateSchemaDashboardData; // Save state to local storage
      LS.setDataState(
        payload.companyId,
        {
          ...oldData,
          activePeriod   : state.activePeriod,
          selectedPeriod : state.selectedPeriod,
        }
      );
    },
  },

  extraReducers: builder => {
    // GET-DATA-FROM-GOOGLE
    builder
      .addCase(getData.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(getData.fulfilled, (state, { payload }: PayloadAction<ResGetGoogleData>) => {
        // Data
        const { startEntities = {}, startDates = {} } = payload.data;
        state.startEntities = startEntities;
        state.startDates    = startDates;
        state.lastUpdated   = new Date().getTime();

        const { activeDates, activeEntities } = getEntitiesByPeriod(startEntities, startDates, state.activePeriod);
        state.activeEntities = activeEntities;
        state.activeDates    = activeDates;

        state.loading     = false;
        state.errors      = {};

        LS.setDataState(payload.companyId, state); // Save state to local storage
      })
      .addCase(getData.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
