import { FC, memo, useCallback, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Night from '@mui/icons-material/Brightness4';
import Day from '@mui/icons-material/Brightness7';
import { CustomTheme, setMode, setSidebarColor, UIDispatch } from 'app/providers/theme';
import { Tooltip } from 'shared/ui/tooltip';
import { f } from 'shared/styles';
import { getIconStyle } from 'shared/ui/configurators-components';
import { PaletteMode } from 'app/providers/theme/types';



interface Props {
  mode     : PaletteMode
  dispatch : UIDispatch
}

export const PaletteModeSwitcherIconComponent: FC<Props> = memo(({ mode, dispatch }) => {
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(mode === 'light');
  }, [mode]);

  const togglePaletteMode = useCallback(() => {
    setMode(dispatch, mode === 'dark' ? 'light' : 'dark');
    setSidebarColor(dispatch, mode === 'dark' ? 'sidebar_grey' : 'sidebar_black');
  }, [mode, dispatch]);


  return (
    <IconButton
      sx      = {{ cursor: 'pointer' }}
      color   = 'inherit'
      onClick = {togglePaletteMode}
    >
      <Tooltip
        title  = {`Переключить на ${checked ? 'тёмную' :  'светлую'} тему`}
        sxSpan = {f('-c-c')}
      >
        {
          checked
            ? <Day   sx={(theme) => getIconStyle(theme as CustomTheme)} />
            : <Night sx={(theme) => getIconStyle(theme as CustomTheme)} />
        }
      </Tooltip>
    </IconButton>
  )
});
