import { FC, memo, useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Autorenew';
import { useCompany } from 'entities/company';
import { useUI } from 'entities/ui';
import { useDashboardGetData } from '../../model/hooks';
import { usePages } from 'shared/lib/hooks';
import { NO_SHEET_ID } from 'entities/dashboard-view';
import { MenuIcon } from 'shared/ui/menu-icon';



export const DashboardRefreshButton: FC = memo(() => {
  const { serviceGetData } = useDashboardGetData();
  const { setPageLoading } = useUI();
  const { paramsCompanyId } = useCompany();
  const { dashboardSheetId = NO_SHEET_ID } = usePages();


  const handleRefresh = useCallback(() => {
    serviceGetData({
      dashboardSheetId, // For check доступ (для неавторизованных)
      companyId: paramsCompanyId
    });
    setPageLoading({ 'get-g-data': { name: 'RefreshButton', text: 'Загрузка данных c google-таблицы...' } });
  },
    [paramsCompanyId, dashboardSheetId, serviceGetData, setPageLoading]
  );


  return (
    <MenuIcon
      id        = 'control-refresh-btn'
      toolTitle = 'Обновить данные из google-таблицы'
      icon      = {RefreshIcon}
      onClick   = {handleRefresh}
    />
  )
});
