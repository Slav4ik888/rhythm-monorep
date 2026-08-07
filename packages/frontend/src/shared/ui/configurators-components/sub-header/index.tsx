import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { f, pxToRem } from 'shared/styles';
import { ConfiguratorTitle } from '../sub-title';



interface Props {
  title    : string
  children : ReactNode
}

export const ConfiguratorSubHeader: FC<Props> = memo(({ title, children }) => (
  <Box
    sx={{
      ...f('c'),
      width : '100%',
      pt    : 2,
      pr    : 2,
    }}
  >
    <ConfiguratorTitle title={title} type='title1' />
    {
      children
    }
  </Box>
));
