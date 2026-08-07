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

import { FC, ReactNode } from 'react';
import { useUIConfiguratorController, CustomTheme } from 'app/providers/theme';
import MDBox from '../../mui-design-components/md-box';
import { pxToRem } from 'shared/styles';
import { usePages } from 'shared/lib/hooks';
import { useAccess } from 'entities/company';



interface Props {
  body?    : boolean // для него добавляем minHeight
  children : ReactNode
}

/**
 * Регулирует, на сколько нужно отодвинуть элемент от левого края (Sidebar)
 */
export const SidebarRegulatorWrapper: FC<Props> = ({ children, body }) => {
  const [configuratorState] = useUIConfiguratorController();
  const { isSidebar, sidebarMini, sidebarWidth } = configuratorState;
  const { isDashboardPage } = usePages();
  const { isDashboardAccessView } = useAccess();

  const isBody   = body;
  const isNavbar = ! isBody;

  return (
    <MDBox
      sx={({ breakpoints, transitions }: CustomTheme) => ({
        position   : 'relative',
        overflowX  : 'scroll',
        minHeight  : isBody
          ? 'calc(100vh - 200px)'
          : 0,

        marginLeft: ! isDashboardPage || ! isDashboardAccessView
          ? 0
          : isSidebar
            ? sidebarMini
              ? pxToRem(112)
              : pxToRem(sidebarWidth + 16)
            : 0,

        p: 0,

        [breakpoints.down('sm')]: {
          marginLeft: ! isDashboardPage || ! isDashboardAccessView
            ? 0
            : isSidebar
              ? sidebarMini ? 0 : pxToRem(sidebarWidth)
              : 0,
        },
        [breakpoints.up('sm')]: {
          px: 2,
          pt: isNavbar
            ? 'calc(1rem + 2px)'
            : '',
          },
        [breakpoints.up('xl')]: {
          transition: transitions.create(['margin-left', 'margin-right'], {
            easing: transitions.easing.easeInOut,
            duration: transitions.duration.standard,
          }),
        },
      })}
    >
      {children}
    </MDBox>
  );
}
