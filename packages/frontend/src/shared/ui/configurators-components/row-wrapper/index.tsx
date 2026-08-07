import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { f, SxCard } from 'shared/styles';



interface Props {
  sx?      : SxCard
  children : ReactNode
}

export const RowWrapper: FC<Props> = memo(({ children, sx }) => (
  <Box
    sx={{
      ...f('-c-sb'),
      position : 'relative',
      width    : '100%',
      gap      : 2,
      py       : 0.5,
      ...sx?.root
    }}
  >
    {children}
  </Box>
));
