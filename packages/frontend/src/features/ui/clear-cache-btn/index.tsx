import { FC, memo, useCallback } from 'react';
import { Tooltip } from 'shared/ui/tooltip';
import Box from '@mui/material/Box';
import { LS } from 'shared/lib/local-storage';
import { useUI } from 'entities/ui';
import { CustomTheme } from 'app/providers/theme';



export const ClearCacheBtn: FC = memo(() => {
  const { setSuccessMessage } = useUI();

  const handleClick = useCallback(() => {
    LS.clearStorage();
    setSuccessMessage('Кэш очищен');
    location.reload();
  },
    [setSuccessMessage]
  );


  return (
    <Tooltip title='Нажмите, чтобы очистить кэш и обновить страницу'>
      <Box
        sx={(theme) => {
          const { breakpoints } = theme as CustomTheme;

          return {
            color     : 'text.light',
            textAlign : 'right',
            cursor    : 'pointer',

            '&:hover' : {
              color: 'text.main'
            },

            [breakpoints.down('sm')]: {
              textAlign: 'left',
            },
          }
        }}
        onClick={handleClick}
      >
        Очистить кэш и обновить
      </Box>
    </Tooltip>
  )
});
