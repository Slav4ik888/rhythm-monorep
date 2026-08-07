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

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
  CustomTheme, ColorName, GradientColorName, RadiusName, GreyColor, Shadows, ColoredShadowsName
 } from 'app/providers/theme';
import { linearGradient, getBoxShadows } from 'shared/styles';



interface OwnerState {
  variant       : string
  color         : ColorName
  bgColor       : GreyColor | GradientColorName
  opacity       : number
  borderRadius  : RadiusName
  shadow        : Shadows
  coloredShadow : string
}


// @ts-ignore
export default styled(Box)(({ theme, ownerState }: { theme: CustomTheme, ownerState: OwnerState }) => {
  const { palette, borders } = theme;
  const { variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow } = ownerState;

  const { gradients, grey, white } = palette;
  const { borderRadius: radius } = borders;

  const greyColors = {
    'grey-100': grey[100],
    'grey-200': grey[200],
    'grey-300': grey[300],
    'grey-400': grey[400],
    'grey-500': grey[500],
    'grey-600': grey[600],
    'grey-700': grey[700],
    'grey-800': grey[800],
    'grey-900': grey[900],
  };


  const validGradients: GradientColorName[] = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'dark',
    'light',
    'department_7',
    'department_1',
    'department_2',
    'department_3',
    'department_4',
    'department_5',
    'department_6',
  ];

  const validColors = [
    'transparent',
    'white',
    'black',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
    'light',
    'dark',
    'text',
    'grey-100',
    'grey-200',
    'grey-300',
    'grey-400',
    'grey-500',
    'grey-600',
    'grey-700',
    'grey-800',
    'grey-900',
  ];

  const validBorderRadius = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'section'];
  const validBoxShadows = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'inset'];

  // background value
  let backgroundValue = bgColor as string;

  if (variant === 'gradient') {
    backgroundValue = validGradients.find((el) => el === bgColor)
      ? linearGradient(gradients[bgColor as GradientColorName].main, gradients[bgColor as GradientColorName].state)
      : white.main;
  }
  else if (validColors.find((el) => el === bgColor)) {
    backgroundValue = palette[bgColor as ColorName]
      ? palette[bgColor as ColorName]?.main
      : greyColors[bgColor as GreyColor];
  }
  else {
    backgroundValue = bgColor;
  }

  // color value
  let colorValue = palette.black.main;

  if (validColors.find((el) => el === color)) {
    colorValue = palette[color] ? palette[color].main : greyColors[color as GreyColor];
  }

  // borderRadius value
  let borderRadiusValue = borderRadius as string;

  if (validBorderRadius.find((el) => el === borderRadius)) {
    borderRadiusValue = radius[borderRadius];
  }

  // boxShadow value
  let boxShadowValue = 'none';

  if (validBoxShadows.find((el) => el === shadow)) {
    boxShadowValue = getBoxShadows(theme)[shadow];
  }
  else if (coloredShadow) {
    const { colored } = getBoxShadows(theme);

    boxShadowValue = colored[coloredShadow as ColoredShadowsName]
      ? colored[coloredShadow as ColoredShadowsName]
      : 'none';
  }

  return {
    opacity,
    background   : backgroundValue,
    color        : colorValue,
    borderRadius : borderRadiusValue,
    boxShadow    : boxShadowValue,
  };
});
