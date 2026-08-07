/* eslint-disable prefer-destructuring */
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
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { CustomTheme, ColorName, ColoredShadowsName, GradientColorName } from 'app/providers/theme';
import { SxCard, getBoxShadows, pxToRem, rgbaFromHex, boxShadow, linearGradient } from 'shared/styles';


interface OwnerState {
  color    : ColorName
  variant  : string
  size     : string
  circular : boolean
  iconOnly : boolean
  darkMode : boolean
  sx       : SxCard | undefined
}

// @ts-ignore
export default styled(Button)(({ theme, ownerState }: { theme: CustomTheme, ownerState: OwnerState }) => {
  const { palette, borders, transitions } = theme;
  const { color, variant, size, circular, iconOnly, darkMode, sx } = ownerState;

  const { white, text, transparent, gradients, grey, sidebar, dark } = palette;
  const { borderRadius } = borders;
  const { colored } = getBoxShadows(theme);

  // styles for the button with variant='contained'
  const containedStyles = () => {
    // background color value
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    // backgroundColor value when button is focused
    const focusedBackgroundValue = palette[color] ? palette[color].focus : white.focus;

    // boxShadow value
    const boxShadowValue = colored[color as ColoredShadowsName]
      ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow(
          [0, 3],
          [1, -2],
          palette[color].main,
          0.2
        )}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
      : 'none';

    // boxShadow value when button is hovered
    const hoveredBoxShadowValue = colored[color as ColoredShadowsName]
      ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow(
          [0, 4],
          [23, 0],
          palette[color].main,
          0.15
        )}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
      : 'none';

    // color value
    let colorValue = white.main;

    if (! darkMode && (color === 'white' || color === 'light' || ! palette[color])) {
      colorValue = text.main;
    }
    else if (darkMode && (color === 'white' || color === 'light' || ! palette[color])) {
      colorValue = grey[600];
    }

    // color value when button is focused
    let focusedColorValue = white.main;

    if (color === 'white') {
      focusedColorValue = text.main;
    } else if (color === 'primary' || color === 'error' || color === 'dark') {
      focusedColorValue = white.main;
    }

    return {
      background: backgroundValue,
      color: colorValue,
      boxShadow: boxShadowValue,

      '&:hover': {
        backgroundColor: backgroundValue,
        boxShadow: hoveredBoxShadowValue,
      },

      '&:focus:not(:hover)': {
        backgroundColor: focusedBackgroundValue,
        boxShadow: palette[color]
          ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
          : boxShadow([0, 0], [0, 3.2], white.main, 0.5),
      },

      '&:disabled': {
        backgroundColor: backgroundValue,
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with variant='outlined'
  const outliedStyles = () => {
    // background color value
    const backgroundValue = color === 'white' ? rgbaFromHex(white.main, 0.1) : transparent.main;

    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    // border color value
    let borderColorValue = palette[color] ? palette[color].main : rgbaFromHex(white.main, 0.75);

    if (color === 'white') {
      borderColorValue = rgbaFromHex(white.main, 0.75);
    }

    return {
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,

      '&:hover': {
        background: rgbaFromHex(white.main, 0.02), // transparent.main,
        borderColor: colorValue,
      },

      '&:focus:not(:hover)': {
        background: transparent.main,
        boxShadow: boxShadowValue,
      },

      '&:active:not(:hover)': {
        backgroundColor: colorValue,
        color: white.main,
        opacity: 0.85,
      },

      '&:disabled': {
        color: text.light, // colorValue,
        borderColor: text.light, // colorValue,
      },
    };
  };

  // styles for the button with variant='gradient'
  const gradientStyles = () => {
    // background value
    let backgroundValue = white.main;

    // if (color === 'white') backgroundValue = white.main;
    if (color === 'sidebar' && sidebar.gradients.main) {
      backgroundValue = linearGradient(sidebar.gradients.main, sidebar.gradients.state);
    }
    else if (gradients[color as GradientColorName]) {
      backgroundValue = linearGradient(
        gradients[color as GradientColorName].main,
        gradients[color as GradientColorName].state
      );
    }

    // boxShadow value
    const boxShadowValue = colored[color as ColoredShadowsName]
      ? `${boxShadow([0, 3], [3, 0], palette[color].main, 0.15)}, ${boxShadow(
          [0, 3],
          [1, -2],
          palette[color].main,
          0.2
        )}, ${boxShadow([0, 1], [5, 0], palette[color].main, 0.15)}`
      : 'none';

    // boxShadow value when button is hovered
    const hoveredBoxShadowValue = colored[color as ColoredShadowsName]
      ? `${boxShadow([0, 14], [26, -12], palette[color].main, 0.4)}, ${boxShadow(
          [0, 4],
          [23, 0],
          palette[color].main,
          0.15
        )}, ${boxShadow([0, 8], [10, -5], palette[color].main, 0.2)}`
      : 'none';

    // color value
    let colorValue = white.main;

    if (color === 'white') {
      colorValue = text.main;
    }
    else if (color === 'light') {
      colorValue = gradients.dark.state;
    }

    return {
      color      : colorValue,
      background : backgroundValue,
      boxShadow  : boxShadowValue,
      transition : transitions.create(['opacity', 'background-color'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.shorter,
      }),
      '&:hover': {
        boxShadow: hoveredBoxShadowValue,
        opacity: 0.85,
      },

      '&:focus:not(:hover)': {
        boxShadow: boxShadowValue,
      },

      '&:disabled': {
        color      : colorValue,
        background : backgroundValue,
      },
    };
  };

  // styles for the button with variant='text'
  const textStyles = () => {
    const colorValue = palette[color] ? palette[color].main : white.main;
    const backgroundValue = rgbaFromHex(palette[color] ? palette[color].main : dark.main, 0.08);

    // color value when button is focused
    const focusedColorValue = palette[color] ? palette[color].focus : white.focus;

    return {
      color: colorValue,

      '&:hover': {
        color      : focusedColorValue,
        background : backgroundValue,
      },

      '&:focus:not(:hover)': {
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with circular={true}
  const circularStyles = () => ({
    borderRadius: borderRadius.section,
  });

  // styles for the button with iconOnly={true}
  const iconOnlyStyles = () => {
    // width, height, minWidth and minHeight values
    let sizeValue = pxToRem(38);

    if (size === 'small') {
      sizeValue = pxToRem(25.4);
    }
    else if (size === 'large') {
      sizeValue = pxToRem(52);
    }

    // padding value
    let paddingValue = `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}`;

    if (size === 'small') {
      paddingValue = pxToRem(4.5);
    }
    else if (size === 'large') {
      paddingValue = pxToRem(16);
    }

    return {
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,
      padding: paddingValue,

      '& .material-icons': {
        marginTop: 0,
      },

      '&:hover, &:focus, &:active': {
        transform: 'none',
      },
    };
  };

  return {
    ...(variant === 'contained' && containedStyles()),
    ...(variant === 'outlined' && outliedStyles()),
    ...(variant === 'gradient' && gradientStyles()),
    ...(variant === 'text' && textStyles()),
    ...(circular && circularStyles()),
    ...(iconOnly && iconOnlyStyles()),
    ...sx?.root,
  };
});
