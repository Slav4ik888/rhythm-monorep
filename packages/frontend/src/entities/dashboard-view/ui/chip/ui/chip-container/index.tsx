import { FC, memo } from 'react';
import Chip from '@mui/material/Chip';
import { f, pxToRem } from 'shared/styles';



export interface SxChipContainer {
  color      : string
  background : string
  width?     : string
  height?    : string
  mr?        : number
}


const useStyle = (sx: SxChipContainer) => ({
    tooltip: {
      ...f('-c'),
      height     : pxToRem(20),
      cursor     : 'default',
    },
    chip: {
      width      : sx.width      || pxToRem(70),
      height     : sx.height     || pxToRem(15),
      fontSize   : pxToRem(12),
      color      : sx.color      || '#000',
      background : sx.background || '#eee',
      mr         : sx.mr         || 'inherit',
    },
  });


interface Props {
  label     : string
  sx        : SxChipContainer
}

/**
 * Base Chip container
 */
export const ChipContainer: FC<Props> = memo(({ label, sx: style }) => {
  const sx = useStyle(style);

  return (
    <Chip
      label = {label}
      size  = 'small'
      sx    = {sx?.chip}
    />
  )
});
