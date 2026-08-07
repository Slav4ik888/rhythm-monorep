import { FC, memo, useCallback } from 'react';
import MuiMenuIcon from '@mui/icons-material/Menu';
import MuiMenuOpenIcon from '@mui/icons-material/MenuOpen';
import {
  useTheme, useUIConfiguratorController, CustomTheme, setSidebarMini, setIsSidebar, setLeftOffsetScrollButton
} from 'app/providers/theme';
import { calcLeftOffsetScrollButton } from 'app/providers/theme/utils';
import { MenuIcon } from 'shared/ui/menu-icon';



const useStyles = (theme: CustomTheme) => ({
  button: {
    display    : 'inline-block',
    lineHeight : 0,

    [theme.breakpoints.down('xl')]: {
      display: 'none',
    },
  }
});



export const MiniSidebarToggleBtn: FC = memo(() => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const sx = useStyles(useTheme());
  const { sidebarMini, isSidebar } = configuratorState;

  const handleMiniSidebar = useCallback(() => {
    setSidebarMini(dispatch, ! sidebarMini);
    if (! isSidebar) setIsSidebar(dispatch, true);
    setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(true, ! sidebarMini));
  }, [sidebarMini, isSidebar, dispatch]);


  return (
    <MenuIcon
      disableRipple
      toolTitle = 'Скрыть/показать боковую панель'
      icon      = {sidebarMini ? MuiMenuIcon : MuiMenuOpenIcon}
      sx        = {sx}
      onClick   = {handleMiniSidebar}
    />
  )
});
