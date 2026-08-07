import { f } from 'shared/styles';
import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';



interface Props {
  children: ReactNode
}

export const MainLayoutWrapper: FC<Props> = memo(({ children }) => (
  <Box
    sx={{
      ...f('c--sb'),
      height     : '100%',
      minHeight  : '100vh',
      // eslint-disable-next-line max-len
      // fontFamily : '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    }}
  >
    {children}
  </Box>
));
