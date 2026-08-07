import { memo } from 'react';
import IconButton from '@mui/material/IconButton';
import MDBox from 'shared/ui/mui-design-components/md-box';
import ArrowBack from '@mui/icons-material/ArrowBackIos';
import { setSidebarMini, useUIConfiguratorController } from 'app/providers/theme';



export const ArrowBackBtn = memo(() => {
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { sidebarMini } = configuratorState;

  const handleSetSidebarMini = () => setSidebarMini(dispatch, ! sidebarMini);
  const handleCloseSidebar = () => setSidebarMini(dispatch, true);


  return (
    <MDBox
      display={{ xs: 'block', xl: 'none' }}
      position='absolute'
      top={8}
      right={-4}
      p={1.625}
      sx={{ cursor: 'pointer' }}
      onClick={handleCloseSidebar}
    >
      <IconButton
        size    = 'small'
        color   = 'inherit'
        onClick = {handleSetSidebarMini}
      >
        <ArrowBack fontSize='small' color='secondary' />
      </IconButton>
    </MDBox>
  )
});
