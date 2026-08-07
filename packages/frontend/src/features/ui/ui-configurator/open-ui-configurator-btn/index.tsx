import { FC, memo } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { setIsOpenConfigurator, useUIConfiguratorController } from 'app/providers/theme';
import { MenuIcon } from 'shared/ui/menu-icon';



export const OpenUIConfiguratorBtn: FC = memo(() => {
  const [_, dispatch] = useUIConfiguratorController();

  const handleOpenConfigurator = () => setIsOpenConfigurator(dispatch, true);

  return (
    <MenuIcon
      toolTitle = 'Настройки интерфейса'
      icon      = {SettingsIcon}
      onClick   = {handleOpenConfigurator}
    />
  )
});
