import { FC, memo } from 'react';
import { MDBox } from 'shared/ui/mui-design-components';
import { PeriodType, SetPeriodDate } from 'features/dashboard-data';



export const SettingDatePeriod: FC = memo(() => (
  <MDBox display='flex'>
    <PeriodType />

    <SetPeriodDate type='start' />
    <SetPeriodDate type='end' />

    {/* <UpdateGraphicsBtn /> */}
  </MDBox>
));
