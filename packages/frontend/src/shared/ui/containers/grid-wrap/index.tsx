import { FC, memo, ReactNode } from 'react';
import Grid, { GridSize } from '@mui/material/Grid';



export interface GridStyle {
  lg? : GridSize
  md? : GridSize
  sm? : GridSize
  xl? : GridSize
  xs? : GridSize
}


type Props = {
  grid?     : GridStyle
  sx?       : any    // Styles for Gridbox
  children? : ReactNode
  onClick?  : () => void
}

/**
 * v.2025-01-03
 */
export const GridWrap: FC<Props> = memo(({ grid, children, sx, onClick }) => (
  <Grid
    sx={{
      ...sx?.root,
      lg : grid?.lg || 12,
      md : grid?.md || 12,
      sm : grid?.sm || 3,
      xl : grid?.xl || 12,
      xs : grid?.xs || 12,
    }}
    onClick = {onClick}
  >
    {
      children
    }
  </Grid>
));
