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
import { CustomTheme } from 'app/providers/theme';
import { getBoxShadows, linearGradient, pxToRem } from 'shared/styles';



// @ts-ignore
export default styled(Drawer)(({ theme, ownerState }) => {
  const { transitions, breakpoints, borders: { borderRadius }, palette: { configurator } } = theme as CustomTheme;
  const { isOpenConfigurator } = ownerState;

  const configuratorWidth = 400;

  // drawer styles when openConfigurator={true}
  const drawerOpenStyles = () => ({
    width        : '100%',
    height       : '100%',
    maxWidth     : configuratorWidth,
    right        : 0,
    margin       : 0,
    padding      : pxToRem(12),
    paddingLeft  : pxToRem(24),
    borderRadius : 0,
    transition: transitions.create('right', {
      easing   : transitions.easing.sharp,
      duration : transitions.duration.short,
    }),

    [breakpoints.up('sm')]: {
      width        : configuratorWidth,
      height       : 'calc(100% - 2rem)', // 'max-content', // '100vh',
      margin       : '1rem',
      padding      : pxToRem(24),
      paddingLeft  : pxToRem(32),
      borderRadius : borderRadius.xl,
    },
  });

  // drawer styles when openConfigurator={false}
  const drawerCloseStyles = () => ({
    right : pxToRem(-390),
    transition: transitions.create('all', {
      easing   : transitions.easing.sharp,
      duration : transitions.duration.short,
    }),
  });


  return {
    '& .MuiDrawer-paper': {
      left         : 'initial',
      background   : linearGradient(configurator.gradients.main, configurator.gradients.state),
      boxShadow    : getBoxShadows(theme as CustomTheme).lg,
      overflowY    : 'auto',

      ...(isOpenConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
    },
  };
});
