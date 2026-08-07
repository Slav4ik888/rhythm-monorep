import * as s from '../../selectors';
import { actions as a } from '../../slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { Errors } from 'shared/lib/validators';
import { StateSchemaDashboardData } from '../../slice/state-schema';
import { SetActivePeriod, SetSelectedPeriod } from '../../slice/types';
import { useMemo } from 'react';



interface Config {
  kod?: string
}

export const useDashboardData = (config: Config = {}) => {
  const { kod } = config;
  const dispatch = useAppDispatch();

  const loading             = useSelector(s.selectLoading);
  const errors              = useSelector(s.selectErrors);
  const isMounted           = useSelector(s.selectIsMounted);

  const startEntities       = useSelector(s.selectStartEntities);
  const startDates          = useSelector(s.selectStartDates);
  const kods                = useSelector(s.selectKods);
  const selectItemByKod     = s.makeSelectItemByKod(kod);
  const itemByKod           = useSelector(selectItemByKod);

  const activeEntities      = useSelector(s.selectActiveEntities);
  const activeDates         = useSelector(s.selectActiveDates);

  const lastUpdated         = useSelector(s.selectLastUpdated);

  const activePeriod        = useSelector(s.selectActivePeriod);
  const activePeriodType    = activePeriod?.type;
  const activeDateStart     = activePeriod?.start;
  const activeDateEnd       = activePeriod?.end;

  const selectedPeriod      = useSelector(s.selectSelectedPeriod);
  const selectedPeriodType  = selectedPeriod?.type;
  const selectedDateStart   = selectedPeriod?.start;
  const selectedDateEnd     = selectedPeriod?.end;


  const api = useMemo(() => ({
    setErrors         : (errors: Errors) => dispatch(a.setErrors(errors)),
    clearErrors       : () => dispatch(a.setErrors({})),
    setInitial        : (state: StateSchemaDashboardData) => dispatch(a.setInitial(state)),
    setActivePeriod   : (data: SetActivePeriod) => dispatch(a.setActivePeriod(data)),
    setSelectedPeriod : (data: SetSelectedPeriod) => dispatch(a.setSelectedPeriod(data)),
  }),
    [dispatch]
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
  }
};
