/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { FC, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarRoot from './styled';
import {
  useUIConfiguratorController, setSidebarMini, useTheme, setLeftOffsetScrollButton, setIsMobileOpenSidebar
} from 'app/providers/theme';
import { SidebarLogoLabel } from '../logo-label';
// import { SidebarUpgradeButton } from '../upgrade-button';
import { calcLeftOffsetScrollButton } from 'app/providers/theme/utils';
import { SidebarList } from '../list';
import { useUI } from 'entities/ui';



interface Props {
  onMouseEnter? : () => void
  onMouseLeave? : () => void
}


export const SidebarContainer: FC<Props> = ({ ...rest }) => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { sidebarMini, sidebarWidth, isSidebar, isMobileOpenSidebar } = configuratorState;
  const theme = useTheme();
  const { breakpoints: { values: { xl, sm } } } = theme;
  const location = useLocation();
  const { isMobile } = useUI();


  useEffect(() => {
    // A function that sets the mini state of the sidebar.
    function handleSidebarChanges() {
      const calcSidebarMini = window.innerWidth < xl || sidebarMini;
      setSidebarMini(dispatch, calcSidebarMini); // Если изначально мини, то нужно его оставить если экран > 1200
      setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(isSidebar, calcSidebarMini));
      // setIsSidebar(dispatch, window.innerWidth > sm || isSidebar);
    }

    // The event listener that's calling the handleSidebarMini function when resizing the window.
    window.addEventListener('resize', handleSidebarChanges);

    // Call the handleSidebarMini function to set the state with the initial value.
    handleSidebarChanges();

    return () => window.removeEventListener('resize', handleSidebarChanges);
  },
    [dispatch, location, isSidebar, sidebarMini, sm, xl]
  );

  const handleMobileClose = useCallback(() => {
    if (! isMobile) return;

    setIsMobileOpenSidebar(dispatch, false);
  },
    [isMobile, dispatch]
  );


  return (
    // @ts-ignore
    <SidebarRoot
      {...rest}
      variant    = 'permanent'
      ownerState = {{ sidebarMini, sidebarWidth, isSidebar, isMobileOpenSidebar, isMobile }}
      onClick    = {handleMobileClose}
    >
      <SidebarLogoLabel />
      <SidebarList />
      {/* <SidebarUpgradeButton /> */}
    </SidebarRoot>
  );
}
