import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { f, rgbaFromHex } from 'shared/styles';
import { ConfiguratorTitle } from '../sub-title';
import { CustomTheme } from 'app/providers/theme';



interface Props {
  title    : string
  children : ReactNode
}

export const ConfiguratorSubHeaderActive: FC<Props> = memo(({ title, children }) => (
  <Box
    sx={(theme) => ({
      ...f('c'),
      width        : '100%',
      border       : `1px solid ${(theme as CustomTheme).palette.configurator.title.title2}`,
      borderRadius : '12px',
      background   : rgbaFromHex((theme as CustomTheme).palette.configurator.title.title2, 0.1),
      mt           : 2,
      px           : 2,
      pb           : 2,
    })}
  >
    <ConfiguratorTitle title={title} type='title2' />
    {
      children
    }
  </Box>
));
