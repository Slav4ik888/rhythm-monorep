import { FC, useCallback, useState } from 'react';
import { MenuIcon } from './icon-button';
import { Menu } from './menu';
import { Popover } from './popover';
import IconDefault from '@mui/icons-material/Menu';



interface Props {
  icon?      : MuiIcon
  toolTitle? : string
  menu?      : FC<{ onClose: () => void }> // Render меню или popover
  popover?   : FC<{ open: boolean, onClose?: () => void }>
}

/**
 * Кнопка активация открытия / закрытия меню
 */
export const MenuIconContainer: FC<Props> = ({ icon, menu: MenuComponent, toolTitle, popover }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handleMenuOpen = useCallback((event: { currentTarget: HTMLElement }) => setAnchorEl(event.currentTarget),
    []
  );

  const handleMenuClose = useCallback(() => setAnchorEl(null),
    []
  );


  return (
    <>
      <MenuIcon
        icon      = {icon ? icon : IconDefault}
        toolTitle = {toolTitle}
        onClick   = {handleMenuOpen}
      />

      {
        MenuComponent && (
          <Menu
            open     = {isOpen}
            anchorEl = {anchorEl}
            onClose  = {handleMenuClose}
          >
            <MenuComponent onClose={handleMenuClose} />
          </Menu>
        )
      }
      {
        popover && ! MenuComponent && (
          <Popover
            open     = {isOpen}
            anchorEl = {anchorEl}
            onClose  = {handleMenuClose}
            children = {popover}
          />
        )
      }
    </>
  );
};
