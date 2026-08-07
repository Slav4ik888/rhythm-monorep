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

import { CustomTheme } from 'app/providers/theme';
import { getTypography, pxToRem } from 'shared/styles';


interface OwnerState {
  sidenavMini: boolean;
}

export const styles = (theme: CustomTheme, ownerState: OwnerState) => {
  const { transitions, breakpoints } = theme;
  const { sidenavMini } = ownerState;

  const { fontWeightMedium } = getTypography(theme);

  return {
    fontWeight  : fontWeightMedium,
    wordSpacing : pxToRem(-1),
    ml          : 1,
    transition  : transitions.create('opacity', {
      easing   : transitions.easing.easeInOut,
      duration : transitions.duration.standard,
    }),

    [breakpoints.up('xl')]: {
      opacity: sidenavMini ? 0 : 1,
    },
  };
}
