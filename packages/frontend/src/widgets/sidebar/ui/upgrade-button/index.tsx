import { FC, memo } from 'react';
import { useUIConfiguratorController } from 'app/providers/theme';
import MDButton from 'shared/ui/mui-design-components/md-button';
import { MDBox } from 'shared/ui/mui-design-components';



export const SidebarUpgradeButton: FC = memo(() => {
  const [configuratorState] = useUIConfiguratorController();
  const { sidebarMini } = configuratorState;


  return (
    <MDBox p={2} mt='auto'>
      <MDButton
        fullWidth
        component = 'a'
        href      = ''
        target    = '_blank'
        rel       = 'noreferrer'
        variant   = 'gradient'
        color     = 'sidebar'
      >
        {sidebarMini ? 'pro' : 'upgrade to pro'}
      </MDButton>
    </MDBox>
  )
});
