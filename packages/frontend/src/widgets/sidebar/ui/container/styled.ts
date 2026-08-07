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

// @mui material components
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import { CustomTheme, SIDEBAR_FULL_WIDTH, SIDEBAR_MINI_WIDTH  } from 'app/providers/theme';
import { getBoxShadows, linearGradient, pxToRem } from 'shared/styles';


const DISABLE_WIDTH = -(SIDEBAR_FULL_WIDTH + 70);


interface OwnerState {
  sidebarWidth        : number
  sidebarMini         : boolean
  isSidebar           : boolean
  isMobileOpenSidebar : boolean
  isMobile            : boolean
}

// @ts-ignore
export default styled(Drawer)(({ theme, ownerState }: { theme: CustomTheme, ownerState: OwnerState }) => {
  const { palette: { sidebar }, transitions, breakpoints, borders: { borderRadius } } = theme;
  const { sidebarMini, sidebarWidth, isSidebar, isMobileOpenSidebar, isMobile } = ownerState;
  const { xxl } = getBoxShadows(theme);

  const backgroundValue = linearGradient(sidebar.gradients.main, sidebar.gradients.state);

  const getTransform = () => {
    if (isMobile) {
      if (isMobileOpenSidebar) return 'translateX(0)';
      else return `translateX(${pxToRem(DISABLE_WIDTH)})`;
    }
    else if (isSidebar) return 'translateX(0)';
    else return `translateX(${pxToRem(DISABLE_WIDTH)})`;
  };

  // styles for the sidebar when sidebarMini={false}
  const drawerFullwidthStyles = () => ({
    [breakpoints.up('xl')]: {
      width      : pxToRem(isMobileOpenSidebar ? SIDEBAR_FULL_WIDTH : sidebarWidth),
      transition : transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
  });

  // styles for the sidebar when sidebarMini={true}
  const drawerMiniStyles = () => ({
    width: pxToRem(isMobileOpenSidebar ? SIDEBAR_FULL_WIDTH : SIDEBAR_MINI_WIDTH),

    [breakpoints.down('sm')]: {
      transform: getTransform(),
    },

    [breakpoints.up('xl')]: {
      overflowX: 'hidden',
      transition: transitions.create(['width', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
    },
  });


  return {
    '& .MuiDrawer-paper': {
      border       : 'none',
      boxShadow    : xxl,
      borderRadius : borderRadius.xl,
      background   : backgroundValue,
      height       : 'calc(100vh - 2rem)',
      margin       : '1rem 0 1rem 1rem !important',
      transform    : getTransform(),

      transition   : transitions.create('transform', {
        easing   : transitions.easing.sharp,
        duration : transitions.duration.shorter,
      }),

      [breakpoints.up('xl')]: {
        boxShadow    : xxl,
        marginBottom : 'inherit',
        left         : '0',
        transform    : getTransform(),
      },

      ...(sidebarMini && isSidebar && drawerMiniStyles()),
      ...(! sidebarMini && isSidebar && drawerFullwidthStyles()),
    },
  };
});
