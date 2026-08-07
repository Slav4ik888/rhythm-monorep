import { FC, memo } from 'react';
import Circular from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import Typography from '@mui/material/Typography';



type Props = {
  text?: string
}

/** v.2025-07-06 */
export const PageLoaderRow: FC<Props> = memo(({ text }) => (
  <Box sx={f('-c')}>
    {
      text && <Typography sx={{ color: 'text.dark', mr: 1 }}>{text}</Typography>
    }
    <Circular
      size = {text ? 20 : 60}
      sx   = {{
        '&.MuiCircularProgress-root': {
          color: 'text.dark'
        },
      }}
    />
  </Box>
));
