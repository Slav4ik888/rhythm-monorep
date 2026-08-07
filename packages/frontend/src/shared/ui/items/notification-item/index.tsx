/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef, FC } from 'react';

// @mui material components
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

// Material Dashboard 2 React components
import MDBox from '../../mui-design-components/md-box';
import MDTypography from '../../mui-design-components/md-typography';

// custom styles for the NotificationItem
import menuItem from './styles';


interface Props {
  icon: React.ReactNode;
  title: string;
}

export const NotificationItem: FC<Props> = forwardRef(({ icon, title, ...rest }, ref) => (
  <MenuItem
    {...rest}
    ref={ref}
    // @ts-ignore
    sx={(theme) => menuItem(theme)}
  >
    {/* @ts-ignore */}
    <MDBox component={Link} py={0.5} display='flex' alignItems='center' lineHeight={1}>
      <MDTypography variant='body1' color='secondary' lineHeight={0.75}>
        {icon}
      </MDTypography>
      <MDTypography variant='button' fontWeight='regular' sx={{ ml: 1 }}>
        {title}
      </MDTypography>
    </MDBox>
  </MenuItem>
));
