import { memo, useEffect } from 'react';
import { useDashboardTemplates, reducerDashboardTemplates } from 'entities/dashboard-templates';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';
import { DashboardTemplatesContainer } from './container';



const initialReducers: ReducersList = {
  dashboardTemplates : reducerDashboardTemplates
};

/** Шаблоны */
export const DashboardTemplates = memo(() => {
  const { serviceGetBunchesUpdated } = useDashboardTemplates();

  useEffect(() => {
    serviceGetBunchesUpdated(); /** Get актуальное состояние bunchesUpdated from DB */
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  return (
    <DynamicModuleLoader reducers={initialReducers}>
      <DashboardTemplatesContainer />
    </DynamicModuleLoader>
  )
});
