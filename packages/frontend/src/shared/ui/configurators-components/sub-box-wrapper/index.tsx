import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { CustomTheme } from 'app/providers/theme';
import { f } from 'shared/styles';
import { ConfiguratorTitle } from '../sub-title';



interface Props {
  title    : string
  children : ReactNode
}

export const ConfiguratorSubBoxWrapper: FC<Props> = memo(({ title, children }) => (
  <Box
    sx={(theme) => ({
      ...f('c'),
      width        : '100%',
      border       : `1px solid ${(theme as CustomTheme).palette.text.light}`,
      borderRadius : '8px',
      my           : 1,
      pl           : 1,
      pr           : 2
    })}
  >
    <ConfiguratorTitle title={title} type='title2' />
    {
      children
    }
  </Box>
));
