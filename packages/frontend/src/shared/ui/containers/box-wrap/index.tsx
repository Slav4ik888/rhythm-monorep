import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { SxCard } from 'shared/styles';



type Props = {
  fullWidth? : boolean
  children?  : ReactNode
  sx?        : SxCard
}

/** v.2025-05-27 */
export const BoxWrap: FC<Props> = memo(({ sx: style, children, fullWidth }) => {
  const sx = { ...(style || {}) };

  if (fullWidth) {
    sx.root = {
      ...sx?.root,
      width: '100%',
    }
  }


  return (
    <Box sx={sx.root}>
      {
        children
      }
    </Box>
  )
});
