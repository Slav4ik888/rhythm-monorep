import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { f } from 'shared/styles';
import { CustomTheme } from 'app/providers/theme';



export const Unselected: FC = memo(() => (
  <Box
    sx={(theme) => ({
      ...f('-c-c'),
      color : (theme as CustomTheme).palette.error.main,
      mt    : 8
    })}
  >
    Выберите элемент для редактирования
  </Box>
));
