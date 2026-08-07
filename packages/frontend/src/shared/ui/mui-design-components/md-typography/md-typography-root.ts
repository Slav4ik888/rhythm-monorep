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
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { CustomTheme, ColorName, GradientColorName } from 'app/providers/theme';
import { linearGradient, getTypography } from 'shared/styles';


type FontWeight = 'light' | 'regular' | 'medium' | 'bold';

interface OwnerState {
  color          : ColorName
  textTransform  : 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  verticalAlign? : 'unset' | 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom'
  textGradient?  : boolean
  opacity        : number
  fontWeight?    : FontWeight
  darkMode       : boolean
}


// @ts-ignore
export default styled(Typography)(({ theme, ownerState }: { theme: CustomTheme, ownerState: OwnerState }) => {
  const { palette } = theme;
  const { color, textTransform, verticalAlign, fontWeight = 'regular', opacity, textGradient, darkMode } = ownerState;
  const { gradients, transparent, dark } = palette;
  const { fontWeightLight, fontWeightRegular, fontWeightMedium, fontWeightBold } = getTypography(theme);


  // fontWeight styles
  const fontWeights: Record<FontWeight, number> = {
    light   : fontWeightLight,
    regular : fontWeightRegular,
    medium  : fontWeightMedium,
    bold    : fontWeightBold,
  };

  // styles for the typography with textGradient={true}
  const gradientStyles = () => ({
    backgroundImage:
      color !== 'inherit' && color !== 'text' && color !== 'white' && gradients[color as GradientColorName]
        ? linearGradient(gradients[color as GradientColorName].main, gradients[color as GradientColorName].state)
        : linearGradient(gradients.dark.main, gradients.dark.state),
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: transparent.main,
    position: 'relative',
    zIndex: 1,
  });

  // color value
  let colorValue = color === 'inherit' || ! palette[color]
    ? 'inherit' // если нет цвета, то inherit
    : palette[color].main;

  if (darkMode && (color === 'inherit' || ! palette[color])) {
    colorValue = 'inherit';
  }
  else if (darkMode && color === 'dark') colorValue = dark.main;


  return {
    opacity,
    textTransform,
    verticalAlign,
    textDecoration: 'none',
    color: colorValue,
    fontWeight: fontWeights[fontWeight] && fontWeights[fontWeight],
    ...(textGradient && gradientStyles()),
  };
});
