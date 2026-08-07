import { FC } from 'react';
import { CustomTheme } from 'app/providers/theme';
import { pxToRem } from 'shared/styles';
import cfg from 'app/config';
import { Tooltip } from 'shared/ui/tooltip';
import Box from '@mui/material/Box';



export const VersionWidjet: FC = () => (
  <Tooltip
    title={`Версия ${cfg.VERSION} от ${cfg.ASSEMBLY_DATE}`}
  >
    <Box
      sx={(theme) => {
        const { breakpoints } = theme as CustomTheme;

        return {
          // borderRadius    : pxToRem(12),
          // backgroundColor : (theme as CustomTheme).palette.background.paper,
          color           : 'text.light',
          textAlign       : 'right',

          [breakpoints.down('sm')]: {
            textAlign: 'left',
          },
        }
      }}
    >
      {cfg.VERSION}
    </Box>
  </Tooltip>
);
