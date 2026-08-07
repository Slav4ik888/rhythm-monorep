import { FC, memo } from 'react';
import { MDBox } from 'shared/ui/mui-design-components';
import { sxNavbarRow } from '../styles';
import { DashboardDatebar } from 'widgets/dashboard-data';
import { MiniSidebarToggleBtn } from 'features/ui';
import { CustomTheme } from 'app/providers/theme';



/** For Dashboard page */
export const NavbarControlBox: FC = memo(() => (
  <MDBox
    color = 'inherit'
    mb    = {{ xs: 1, md: 0 }}
    ml    = {{ xs: 0, md: 2 }}
    sx    = {(theme: CustomTheme) => sxNavbarRow(theme)}
  >
    <MiniSidebarToggleBtn />
    <DashboardDatebar />
  </MDBox>
))
