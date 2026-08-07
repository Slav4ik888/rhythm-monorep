import { FC, memo } from 'react';
import { MDBox } from 'shared/ui/mui-design-components';
import { SettingDatePeriod } from './setting-date-period';
import { DashboardRefresh } from './dashboard-refresh';



export const DashboardDatebar: FC = memo(() => (
  <MDBox display='flex' alignItems='center'>
    <SettingDatePeriod />
    <DashboardRefresh />
  </MDBox>
));
