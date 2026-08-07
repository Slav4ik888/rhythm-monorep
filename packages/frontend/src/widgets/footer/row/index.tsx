import { FC, memo, ReactNode } from 'react';
import { CustomTheme } from 'app/providers/theme';
import { getTypography, f } from 'shared/styles';
import Box from '@mui/material/Box';



interface Props {
  children : ReactNode
  height?  : number // Чтобы отценторвать по центру MiddleTopColumn
}

export const FooterRow: FC<Props> = memo(({ children, height }) => (
  <Box
    sx={(theme) => {
      const { breakpoints } = theme as CustomTheme;
      const { size } = getTypography(theme as CustomTheme);

      return {
        ...f('r-fs-sb'),
        width    : '100%',
        color    : 'text',
        fontSize : size.xs,
        height   : height || 'auto',
        pt       : 1,
        pb       : 3,
        px       : 1.5,

        [breakpoints.down('sm')]: {
          flexDirection  : 'column',
          justifyContent : 'flex-start',
          height         : 'auto',
          pb             : 4,
        },
      }
    }}
  >
    {
      children
    }
  </Box>
));
