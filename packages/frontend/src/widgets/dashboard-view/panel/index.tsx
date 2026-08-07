import { memo } from 'react';
import Box from '@mui/material/Box';
import { AddNewViewItem } from 'features/dashboard-view';
import { f } from 'shared/styles';
import { PanelAddViewItemBtns } from './panel-add-btns';
import { CustomTheme } from 'app/providers/theme';



export const DashboardBodyPanel = memo(() => (
  <Box
    sx={(theme) => ({
      ...f(),
      gap          : 2,
      background   : (theme as CustomTheme).palette.editTopPanel.background,
      borderRadius : (theme as CustomTheme).borders.borderRadius.lg,
      mt           : 2,
      p            : 1,
    })}
  >
    <AddNewViewItem
      parentId  = 'no_parentId'
      component = {PanelAddViewItemBtns}
    />
  </Box>
));
