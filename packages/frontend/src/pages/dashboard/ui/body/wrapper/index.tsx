import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';



interface Props {
  children: React.ReactNode
}


export const DashboardBodyWrapper: FC<Props> = memo(({ children }) => (
  <Box
    sx={{
      ...f('c'),
      position  : 'relative',
      // width     : 'max-content',
      minWidth  : '100%',
      // minHeight : 'calc(100vh - 300px)',
      minHeight    : '100%',
    }}
  >
    {children}
  </Box>
));
