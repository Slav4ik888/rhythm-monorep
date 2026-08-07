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

import { ColorName, RadiusName, GreyColor, GradientColorName, Shadows } from 'app/providers/theme';
import { forwardRef, FC } from 'react';
import MDBoxRoot from './md-box-root';


type Flex = 'column' | 'row' | 'row-reverse' | 'column-reverse'

interface Props {
  variant?        : 'contained' | 'gradient'
  bgColor?        : GreyColor | GradientColorName
  color?          : ColorName
  minWidth?       : string
  width?          : string | boolean
  height?         : string
  minHeight?      : string
  opacity?        : number
  borderRadius?   : RadiusName
  mb?             : number | { xs?: number, md?: number }
  mr?             : number | { xs?: number, xl?: number }
  ml?             : string | number | { xs?: number, xl?: number, md?: number }
  mt?             : number | 'auto'
  mx?             : number
  my?             : number
  pr?             : number
  py?             : number
  px?             : number
  pt?             : number
  pb?             : number
  p?              : number
  padding?        : string
  position?       : 'static' | 'relative' | 'absolute' | 'sticky'
  top?            : number
  right?          : number
  fontSize?       : string
  lineHeight?     : number
  textAlign?      : 'center' | 'left' | 'right'
  display?        : 'flex' | 'flex flex-col' | 'inline' | 'none' | { xs: 'block', xl: 'none' }
  flexDirection?  : { xs: Flex, lg: Flex } | 'column' | 'row' | 'row-reverse' | 'column-reverse'
  alignItems?     : 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch'
  justifyContent? : 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  flexWrap?       : 'wrap' | 'flex-start'
  shadow?         : Shadows
  coloredShadow?  : string
  component?      : React.ElementType
  to?             : string
  src?            : string
  alt?            : string
  children?       : React.ReactNode;
  sx?             : any;
  onClick?        : () => void
}


const MDBox: FC<Props> = forwardRef(
  ({
    variant       = 'contained',
    bgColor       = 'transparent',
    color         = 'dark',
    opacity       = 1,
    borderRadius  = 'none',
    shadow        = 'none',
    coloredShadow = 'none',
    ...rest
  }, ref) => (
    <MDBoxRoot
      {...rest}
      ref={ref}
      // @ts-ignore
      ownerState={{ variant, bgColor, color, opacity, borderRadius, shadow, coloredShadow }}
    />
  )
);

export default MDBox;
