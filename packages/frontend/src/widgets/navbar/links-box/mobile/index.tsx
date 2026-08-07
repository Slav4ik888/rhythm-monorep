import { FC, memo } from 'react';
import { MenuIconContainer } from 'shared/ui/menu-icon';
import { AnyLinksBox } from '../any';



export const MobileLinksBox: FC = memo(() => (
  <MenuIconContainer
    menu = {AnyLinksBox}
  />
));
