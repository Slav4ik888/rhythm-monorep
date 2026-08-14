// packages/frontend/src/pages/dashboard/ui/container.tsx

import { FC, memo, useEffect, useMemo } from 'react';
import { Sidebar } from 'widgets/sidebar';
import { DashboardBody } from './body';
import { SidebarRegulatorWrapper } from 'shared/ui/wrappers';
import { getBunchesForLoad, NO_SHEET_ID } from 'entities/dashboard-view';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { useAccess, useCompany } from 'entities/company';
import { LS } from 'shared/lib/local-storage';
import { useDashboardViewServices } from 'features/dashboard-view/model/hooks/use-dashboard-view-services';
import { usePages } from 'shared/lib/hooks';
import { useUI } from 'entities/ui';
import { useUser } from 'entities/user';
import { removeJivoSite } from 'shared/lib/remove-jivo';
import { useGetDashboardDataQuery, useGetBunchesQuery } from 'shared/api/hooks';

export const DashboardPageContainer: FC = memo(() => {
  const { auth } = useUser();
  const { paramsCompanyId, paramsBunchesUpdated } = useCompany();
  const { setDashboardBunchesFromCache } = useDashboardViewServices();
  const { dashboardSheetId = NO_SHEET_ID } = usePages();
  const { setPageLoading } = useUI();
  const { isDashboardAccessView } = useAccess();

  // Вычисляем, какие bunches нужно загрузить с сервера.
  // Учитываем и те, чьё содержимое пустое/отсутствует в LS (рассинхрон с viewBunchesUpdated).
  const bunchesForLoad = useMemo(
    () =>
      getBunchesForLoad(
        paramsBunchesUpdated,
        LS.getViewBunchesUpdated(paramsCompanyId),
        LS.getBunches(paramsCompanyId),
      ),
    [paramsBunchesUpdated, paramsCompanyId],
  );

  // TanStack Query: автоматическая загрузка данных из Google Sheets
  const hasCachedData = !!LS.getDataState(paramsCompanyId)?.startEntities && !!paramsCompanyId;

  useGetDashboardDataQuery({
    companyId: paramsCompanyId,
    dashboardSheetId,
    // Загружаем только если данных ещё нет в LS и есть доступ
    enabled: !hasCachedData && paramsCompanyId !== '' && isDashboardAccessView,
  });

  // TanStack Query: автоматическая загрузка недостающих bunches
  useGetBunchesQuery({
    companyId: paramsCompanyId,
    bunchIds: bunchesForLoad,
    bunchesUpdated: paramsBunchesUpdated,
    dashboardSheetId,
    // Загружаем только если есть bunches для обновления
    enabled: bunchesForLoad.length > 0 && isDashboardAccessView,
  });

  useEffect(
    () => {
      // Если нет доступа — не загружаем
      if (!isDashboardAccessView) return;

      // Убираем Живосайт для авторизованных
      if (auth) removeJivoSite();

      // Загружаем из кеша bunches, в которых нет изменений
      setDashboardBunchesFromCache({
        companyId: paramsCompanyId,
        changedBunches: bunchesForLoad,
      });

      if (bunchesForLoad.length) {
        __devLog('DashboardPageContainer', 'Bunches for load:', bunchesForLoad.length);
        __devLog('DashboardPageContainer', bunchesForLoad);
      } else {
        __devLog('DashboardPageContainer', 'All bunches from cache');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth, paramsCompanyId, paramsBunchesUpdated, isDashboardAccessView],
  );

  return (
    <>
      <Sidebar />

      <SidebarRegulatorWrapper body>
        <DashboardBody />
      </SidebarRegulatorWrapper>
    </>
  );
});
