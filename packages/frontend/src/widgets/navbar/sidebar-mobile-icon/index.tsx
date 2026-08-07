import { FC, useCallback } from 'react';
import IconMenu from '@mui/icons-material/Menu';
import { MenuIcon } from 'shared/ui/menu-icon';
import { setIsMobileOpenSidebar, useUIConfiguratorController } from 'app/providers/theme';



/**
 * Кнопка активация открытия / закрытия Sidebar in mobile
 */
export const SidebarMobileIcon: FC = () => {
  const [_, dispatch] = useUIConfiguratorController();

  const handleOpen = useCallback(() => setIsMobileOpenSidebar(dispatch, true),
    [dispatch]
  );

  return (
    <MenuIcon
      icon      = {IconMenu}
      toolTitle = 'Открыть панель'
      onClick   = {handleOpen}
    />
  );
};
