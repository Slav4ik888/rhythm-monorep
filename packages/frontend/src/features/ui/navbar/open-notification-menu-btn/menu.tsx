import { FC, memo } from 'react';
import Icon from '@mui/material/Icon';
import { NotificationItem } from 'shared/ui/items';



export const NotificationMenu: FC = memo(() => {
  const handleClose = () => {};

  return (
    <>
      <NotificationItem icon={<Icon>email</Icon>} title='Check new messages' />
      <NotificationItem icon={<Icon>podcasts</Icon>} title='Manage Podcast sessions' />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title='Payment successfully completed' />
    </>
  )
});
