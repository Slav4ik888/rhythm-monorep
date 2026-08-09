// packages/frontend/src/widgets/dashboard-templates/ui/templates/index.tsx

import { memo, useEffect } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import { DashboardTemplatesContainer } from './container';

/** Шаблоны */
export const DashboardTemplates = memo(() => {
  const { serviceGetBunchesUpdated } = useDashboardTemplates();

  useEffect(
    () => {
      serviceGetBunchesUpdated(); /** Get актуальное состояние bunchesUpdated from DB */
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return <DashboardTemplatesContainer />;
});
