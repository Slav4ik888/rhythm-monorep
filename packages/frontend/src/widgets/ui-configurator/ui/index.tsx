import { memo } from 'react';
import { setIsOpenConfigurator, useUIConfiguratorController } from 'app/providers/theme';
import DrawerStyled from './styled';
import { PaletteModeSwitcher, SwitcherSidebarMini, SwitcherSidebarColor, SwitcherSidebarHidden } from 'features/ui';
import {
  ConfiguratorSubHeader as SubHeader,
  ConfiguratorMainHeader as MainHeader
} from 'shared/ui/configurators-components';



export const UIConfigurator = memo(() => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { isOpenConfigurator } = configuratorState;

  const handleClose = () => setIsOpenConfigurator(dispatch, false);


  if (! isOpenConfigurator) return null

  return (
    <DrawerStyled
      anchor     = 'right'
      onClose    = {handleClose}
      open       = {isOpenConfigurator}
      // @ts-ignore
      ownerState = {{ isOpenConfigurator }}
    >
      <MainHeader ui onClose={handleClose} />
      <SubHeader title='Тема'>
        <PaletteModeSwitcher ui />
      </SubHeader>

      <SubHeader title='Боковая панель'>
        <SwitcherSidebarMini />
        <SwitcherSidebarHidden />
        <SwitcherSidebarColor />
      </SubHeader>
    </DrawerStyled>
  )
});
