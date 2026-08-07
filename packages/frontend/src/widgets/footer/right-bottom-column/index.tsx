import { FC, memo } from 'react';
import { f } from 'shared/styles';
import { VersionWidjet } from 'widgets/version';
import { ClearCacheBtn } from 'features/ui';
import Box from '@mui/material/Box';



export const FooterBottomRightColumn: FC = memo(() => (
  <Box
    sx={{ ...f('-c-fe'), gap: 1 }}
  >
    <ClearCacheBtn />
    <VersionWidjet />
  </Box>
));
