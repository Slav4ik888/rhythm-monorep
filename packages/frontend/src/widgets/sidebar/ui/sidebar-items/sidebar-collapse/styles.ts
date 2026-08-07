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

import { CustomTheme,  } from 'app/providers/theme';
import { f, getBoxShadows, getTypography, linearGradient, pxToRem, rgbaFromHex } from 'shared/styles';



interface OwnerStateItem {
  active: boolean
}


const collapseItem = (theme: CustomTheme, ownerState: OwnerStateItem) => {
  const { palette, transitions, breakpoints, borders } = theme;
  const { active } = ownerState;
  const darkMode = palette.mode === 'dark';

  const { white, transparent, dark, sidebar } = palette;
  const { md } = getBoxShadows(theme);
  const { borderRadius } = borders;

  return {
    ...f('-c-fs'),
    width        : '100%',
    margin       : `${pxToRem(1.5)}`,
    padding      : `${pxToRem(8)}`,
    borderRadius : borderRadius.md,
    cursor       : 'pointer',
    userSelect   : 'none',
    whiteSpace   : 'nowrap',
    boxShadow    : active && ! darkMode ? md : 'none',

    color        : white.main,
    background   : active
      ? linearGradient(sidebar.gradientsActiveBtn.main, sidebar.gradientsActiveBtn.state, 184)
      : transparent.main,

    [breakpoints.up('xl')]: {
      transition: transitions.create(['box-shadow', 'background-color'], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },

    '&:hover, &:focus': {
      backgroundColor: () => {
        let backgroundValue;

        if (! active) {
          backgroundValue = ! darkMode
            ? rgbaFromHex(dark.main, 0.7)
            : rgbaFromHex(white.main, 0.2);
        }

        return backgroundValue;
      },
    },
  };
}


interface OwnerStateIconBox {
  active: boolean
}

function collapseIconBox(theme: CustomTheme, ownerState: OwnerStateIconBox) {
  const { palette, transitions, borders } = theme;
  const { active } = ownerState;
  const darkMode = palette.mode === 'dark';

  const { white, dark } = palette;
  const { borderRadius } = borders;

  return {
    display      : 'grid',
    minWidth     : pxToRem(32),
    minHeight    : pxToRem(32),

    borderRadius : borderRadius.md,
    placeItems   : 'center',
    color: (! darkMode && ! active) || ! active
      ? white.main
      : dark.main,

    transition: transitions.create('margin', {
      easing   : transitions.easing.easeInOut,
      duration : transitions.duration.standard,
    }),

    '& svg, svg g': {
      color: dark.main,
    },
  };
}



interface IconProp2 {
  active: boolean
}

const collapseIcon = ({ palette: { white, dark } }: CustomTheme, { active }: IconProp2) => ({
  color: active ? white.main : dark.main,
});


interface OwnerStateText {
  sidebarMini         : boolean
  active              : boolean
  isMobileOpenSidebar : boolean
}

function collapseText(theme: CustomTheme, ownerState: OwnerStateText) {
  const { transitions, breakpoints } = theme;
  const { sidebarMini, active, isMobileOpenSidebar } = ownerState;
  const { size, fontWeightRegular, fontWeightLight } = getTypography(theme);


  return {
    opacity    : sidebarMini && ! isMobileOpenSidebar ? 0 : 1,
    maxWidth   : sidebarMini && ! isMobileOpenSidebar ? 0 : '100%',
    marginLeft : sidebarMini && ! isMobileOpenSidebar ? 0 : pxToRem(10),

    [breakpoints.up('xl')]: {
      transition: transitions.create(['opacity', 'margin'], {
        easing   : transitions.easing.easeInOut,
        duration : transitions.duration.standard,
      }),
    },

    '& span': {
      fontWeight   : active ? fontWeightRegular : fontWeightLight,
      fontSize     : size.sm,
      lineHeight   : 1,
      textOverflow : 'ellipsis',
      whiteSpace   : 'nowrap',
      overflow     : 'hidden',
      width        : pxToRem(162),
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
