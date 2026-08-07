import { memo, useEffect, useState } from 'react';
import { setIsSidebar, setLeftOffsetScrollButton, useUIConfiguratorController } from 'app/providers/theme';
import { SwitcherItem } from '../../components/switcher-item';
import { calcLeftOffsetScrollButton } from 'app/providers/theme/utils';



export const SwitcherSidebarHidden = memo(() => {
  const [checked, setChecked] = useState<boolean>(false);
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { isSidebar, sidebarMini } = configuratorState;

  useEffect(() => {
    setChecked(! isSidebar);
  }, [isSidebar]);

  const toggle = () => {
    setIsSidebar(dispatch, ! isSidebar);
    setLeftOffsetScrollButton(dispatch, calcLeftOffsetScrollButton(! isSidebar, sidebarMini));
  };


  return (
    <SwitcherItem
      title     = 'Скрытая'
      checked   = {checked}
      ariaLabel = 'SwitcherSidebarHidden'
      onToggle  = {toggle}
    />
  )
});
