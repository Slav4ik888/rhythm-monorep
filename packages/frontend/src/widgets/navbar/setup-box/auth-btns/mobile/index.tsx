import { FC, memo } from 'react';
import { MobileAuthBtn } from './menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { MenuIconContainer } from 'shared/ui/menu-icon';



export const MobileAuthBtns: FC = memo(() => (
  <MenuIconContainer
    icon={AccountCircle}
    menu={MobileAuthBtn}
  />
));
