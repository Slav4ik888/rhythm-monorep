import { usePages } from 'shared/lib/hooks';
import { useMemo } from 'react';
import { ColorName, useUIConfiguratorController } from 'app/providers/theme';
import { useCompany } from 'entities/company';
import { getDefaultSidebarRoutes } from './get-default-items';
import { getPathBySheetId } from '../../../lib';
import { NO_SHEET_ID } from 'entities/dashboard-view';



export const useSidebar = () => {
  const [configuratorState] = useUIConfiguratorController();
  const { mode } = configuratorState;
  const darkMode = mode === 'dark';
  const { dashboardSheetId: activeSheetId = NO_SHEET_ID } = usePages();
  const { paramsSheets, paramsCompanyId } = useCompany();

  const textColor: ColorName = useMemo(() => {
    if (! darkMode) return 'dark';
    if (darkMode) return 'inherit';
    return 'white' as ColorName
  }, [darkMode]);


  const sidebarRoutes = useMemo(() => [
    ...getDefaultSidebarRoutes(paramsCompanyId),
    ...Object.values(paramsSheets).map(sheet => ({
      ...sheet,
      route: getPathBySheetId(paramsCompanyId, sheet.route)
    })),
  ].sort((a, b) => a.order - b.order),
    [paramsSheets, paramsCompanyId]
  );

  return {
    sidebarRoutes,
    activeSheetId,
    textColor,
  }
};
