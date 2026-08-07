import { FC, memo, useState, useCallback } from 'react';
import { setLeftOffsetScrollButton, setSidebarMini, useUIConfiguratorController } from 'app/providers/theme';
import { SidebarContainer } from './container';
import { calcLeftOffsetScrollButton } from 'app/providers/theme/utils';



export const Sidebar: FC = memo(() => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { sidebarMini, isSidebar } = configuratorState;

  const [onMouseEnter, setOnMouseEnter] = useState(false);


  // Open sidebar when mouse enter on mini sidebar
  const handleOnMouseEnter = useCallback(() => {
    if (sidebarMini && ! onMouseEnter) {
      setSidebarMini(dispatch, false);
      setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(true, false));
      setOnMouseEnter(true);
    }
  }, [onMouseEnter, sidebarMini, dispatch, setOnMouseEnter]);


  // Close sidebar when mouse leave mini sidebar
  const handleOnMouseLeave = useCallback(() => {
    if (onMouseEnter) {
      setSidebarMini(dispatch, true);
      setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(true, true));
      setOnMouseEnter(false);
    }
  }, [onMouseEnter, dispatch, setOnMouseEnter]);

  if (! isSidebar) return null;

  return (
    <SidebarContainer
      onMouseEnter = {handleOnMouseEnter}
      onMouseLeave = {handleOnMouseLeave}
    />
  );
});
