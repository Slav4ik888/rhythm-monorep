import { FC, memo } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { ProfilesMenu } from './menu';
import { MenuIconContainer } from 'shared/ui/menu-icon';



/**
 * Widjet ProfilesMenu
 * Кнопка входа в личные кабинеты активация открытия / закрытия
 */
export const ProfilesMenuRoot: FC = memo(() => (
  <MenuIconContainer
    icon={AccountCircle}
    menu={ProfilesMenu}
  />
));
