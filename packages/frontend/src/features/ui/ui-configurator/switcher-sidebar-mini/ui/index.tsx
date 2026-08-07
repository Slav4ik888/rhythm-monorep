import { memo, useEffect, useState } from 'react';
import {
  setIsSidebar, setLeftOffsetScrollButton, setSidebarMini, useUIConfiguratorController
 } from 'app/providers/theme';
import { SwitcherItem } from '../../components/switcher-item';
import { calcLeftOffsetScrollButton } from 'app/providers/theme/utils';



export const SwitcherSidebarMini = memo(() => {
  const [checked, setChecked] = useState<boolean>(false);
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { sidebarMini } = configuratorState;

  useEffect(() => {
    setChecked(sidebarMini);
  }, [sidebarMini]);

  const toggle = () => {
    setIsSidebar(dispatch, true);
    setSidebarMini(dispatch, ! sidebarMini);
    setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(true, ! sidebarMini));
  };


  return (
    <SwitcherItem
      title     = 'Свёрнутая'
      checked   = {checked}
      ariaLabel = 'MiniSidebarSwitcher'
      onToggle  = {toggle}
    />
  )
});
