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
import MDTypographyRoot from './md-typography-root';
import { ColorName, useUIConfiguratorController } from 'app/providers/theme';
import { TypographyOwnProps } from '@mui/material/Typography';



interface Props extends TypographyOwnProps {
  id?            : string
  display?       : 'block' | 'flex'
  color?         : ColorName
  textTransform? : 'none' | 'capitalize' | 'uppercase' | 'lowercase'
  verticalAlign? : 'unset' | 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom'
  textGradient?  : boolean
  fontSize?      : string
  fontWeight?    : 'light' | 'regular' | 'medium' | 'bold'
  opacity?       : number
  cursor?        : string
  component?     : React.ElementType
  children       : React.ReactNode
  sx?            : any
}


const MDTypography: FC<Props> = forwardRef(
  (
    {
      color         = 'dark',
      fontWeight    = 'regular',
      verticalAlign = 'unset',
      textGradient  = false,
      opacity       = 1,
      textTransform,
      children,
      ...rest
    },
    ref
  ) => {
    const [configuratorState] = useUIConfiguratorController();
    const { mode } = configuratorState;
    const darkMode = mode === 'dark';

    return (
      <MDTypographyRoot
        {...rest}
        // @ts-ignore
        ref={ref}
        ownerState={{
          color,
          textTransform,
          verticalAlign,
          fontWeight,
          opacity,
          textGradient,
          darkMode,
        }}
      >
        {children}
      </MDTypographyRoot>
    );
  }
);


export default MDTypography;
