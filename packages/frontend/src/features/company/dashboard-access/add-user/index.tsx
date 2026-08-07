import { FC, memo } from 'react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { AddUserContainer } from './container';
import { MenuIconContainer } from 'shared/ui/menu-icon';



/**
 * Добавление пользователя в дашборд
 */
export const AddUserRoot: FC = memo(() => (
    <MenuIconContainer
      toolTitle = 'Добавить пользователя'
      icon      = {PersonAddAlt1Icon}
      popover   = {AddUserContainer}
    />
));
