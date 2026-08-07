import { FC, memo } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MenuIconContainer } from 'shared/ui/menu-icon';
import { NotificationMenu } from './menu';



export const OpenNotificationMenuBtn: FC = memo(() => (
    <MenuIconContainer
      toolTitle = 'Центр уведомлений'
      icon      = {NotificationsIcon}
      menu      = {NotificationMenu}
    />
));
