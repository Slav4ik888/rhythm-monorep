import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';



interface Props {
  children : ReactNode
}


export const ProfileContentWrapper: FC<Props> = memo(({ children }) => (
  <Box
    sx={{
      ...f('c'),
      gap      : 3,
      width    : { xs: '100%', md: '50%' },
      maxWidth : pxToRem(300)
    }}
  >
    {children}
  </Box>
));
