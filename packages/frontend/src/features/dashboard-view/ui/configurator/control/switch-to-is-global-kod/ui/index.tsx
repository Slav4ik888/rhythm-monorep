import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions } from 'entities/dashboard-view';
import Box from '@mui/material/Box';
import { Tooltip } from 'shared/ui/tooltip';
import { MDButton } from 'shared/ui/mui-design-components';
import { CustomTheme, useTheme } from 'app/providers/theme';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';


const useStyles = (theme: CustomTheme) => ({
  root: {
    position: 'relative',
  },
  icon: {
    color    : theme.palette.dark.main,
    fontSize : '20px',
  },
});


/**
 * Переключение на ближайший элемент с установленным isGlobalKod
 */
export const SwitchToIsGlobalKod: FC = memo(() => {
  const sx = useStyles(useTheme());
  const { globalKodParent, setSelectedId } = useDashboardViewActions();

  const handleClick = useCallback(() => {
    globalKodParent && setSelectedId(globalKodParent.id);
  }, [globalKodParent, setSelectedId]);

  if (! globalKodParent) return null;

  return (
    <Box sx={sx.root}>
      <Tooltip title='Переключение на ближайший элемент с установленным isGlobalKod'>
        <MDButton
          variant   = 'outlined'
          color     = 'dark'
          onClick   = {handleClick}
        >
          <SwitchAccessShortcutIcon sx={sx.icon} />
        </MDButton>
      </Tooltip>
    </Box>
  )
});
