// packages/frontend/src/shared/ui/mui-design-components/md-typography/index.tsx

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

import { forwardRef, FC, useMemo } from 'react';
import MDTypographyRoot from './md-typography-root';
import { ColorName, useUIConfiguratorController } from 'app/providers/theme';

interface Props {
  id?: string;
  display?: 'block' | 'flex';
  color?: ColorName;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  verticalAlign?: 'unset' | 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom';
  textGradient?: boolean;
  fontSize?: string;
  lineHeight?: number | string;
  textAlign?: 'center' | 'left' | 'right';
  fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
  opacity?: number;
  cursor?: string;
  component?: React.ElementType;
  children: React.ReactNode;
  sx?: any;
  // Допускаем любые остальные пропсы от Typography
  [key: string]: any;
}

/**
 * MDTypography — обёртка над MUI Typography.
 * В MUI 9 системные пропсы (lineHeight, fontSize, textAlign, display и т.д.)
 * больше не принимаются как прямые атрибуты — перемещаем их в sx.
 */
const MDTypography: FC<Props> = forwardRef(
  (
    {
      color = 'dark',
      fontWeight = 'regular',
      verticalAlign = 'unset',
      textGradient = false,
      opacity = 1,
      textTransform,
      // Системные пропсы — собираем в sx
      display,
      lineHeight,
      fontSize,
      textAlign,
      // Остальное
      sx: externalSx,
      component,
      children,
      // Убираем системные пропсы из rest, чтобы не прокидывались в DOM
      ...rest
    },
    ref,
  ) => {
    const [configuratorState] = useUIConfiguratorController();
    const { mode } = configuratorState;
    const darkMode = mode === 'dark';

    // Отфильтровываем системные пропсы из rest (могли прийти через [key: string]: any)
    const {
      display: _display,
      lineHeight: _lineHeight,
      fontSize: _fontSize,
      textAlign: _textAlign,
      sx: _sx,
      ...cleanRest
    } = rest;

    // Собираем системные пропсы в sx
    const sx = useMemo(() => {
      const systemProps = {
        display: display || _display,
        lineHeight: lineHeight || _lineHeight,
        fontSize: fontSize || _fontSize,
        textAlign: textAlign || _textAlign,
      };

      const mergedSx = { ...externalSx, ..._sx };

      // Если mergedSx — функция, оборачиваем
      if (typeof mergedSx === 'function') {
        return (theme: any) => ({ ...systemProps, ...mergedSx(theme) });
      }

      return { ...systemProps, ...mergedSx };
    }, [display, _display, lineHeight, _lineHeight, fontSize, _fontSize, textAlign, _textAlign, externalSx, _sx]);

    return (
      <MDTypographyRoot
        {...cleanRest}
        // @ts-ignore
        ref={ref}
        component={component}
        sx={sx}
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
  },
);

export default MDTypography;
