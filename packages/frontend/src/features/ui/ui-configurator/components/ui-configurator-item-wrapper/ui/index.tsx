import { FC, memo, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { f, getTypography } from 'shared/styles';
import { CustomTheme } from 'app/providers/theme';



interface Props {
  children : ReactNode
}

export const UIConfiguratorItemWrapper: FC<Props> = memo(({ children }) => (
  <Box
    sx={(theme) => ({
      ...f('-c-sb'),
      color    : (theme as CustomTheme).palette.configurator.title.itemColor,
      fontSize :  getTypography(theme as CustomTheme).size.md,
      width    : '100%',
      py       : 4,
    })}
  >
    {children}
  </Box>
));
