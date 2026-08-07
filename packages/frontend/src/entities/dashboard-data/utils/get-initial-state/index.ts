import { LS } from 'shared/lib/local-storage';
import { PeriodType } from '../../constants';
import { StateSchemaDashboardData } from '../../model/slice/state-schema';
import { DashboardPeriod } from '../../types';



/** Returns initialState из данных сохранённых в LS by companyId */
export const getInitialState = (companyId: string): StateSchemaDashboardData => {
  const emptyPeriod: DashboardPeriod = {
    type  : PeriodType.NINE_MONTHS,
    start : undefined,
    end   : Date.now()
  };

  const state = LS.getDataState(companyId);
  const activePeriod = state?.activePeriod || { ...emptyPeriod };

  const initialState: StateSchemaDashboardData = {
    loading        : false,
    errors         : {},
    _isMounted     : true,

    startEntities  : state?.startEntities  || {},
    startDates     : state?.startDates     || {},
    lastUpdated    : state?.lastUpdated    || undefined, // Дата последнего обновления

    selectedPeriod : activePeriod,
    activePeriod,
    activeEntities : state?.activeEntities || {},
    activeDates    : state?.activeDates    || {},
  };

  return initialState;
}
