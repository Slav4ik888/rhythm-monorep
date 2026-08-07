import { FC, memo } from 'react';
import { DashboardRefreshButton } from 'features/dashboard-data';
import { MDBox } from 'shared/ui/mui-design-components';
import { DashboardLastUpdatedText } from './last-updated-text';



export const DashboardRefresh: FC = memo(() => (
  <MDBox ml={1} display='flex' alignItems='center'>
    <DashboardRefreshButton />
    <DashboardLastUpdatedText />
  </MDBox>
));
