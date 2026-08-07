import { FC, memo } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import Box from '@mui/material/Box';
import { RowWrapperTitle } from 'shared/ui/configurators-components';
import { styleAtom } from '../styles';



export const ViewItemTypeContainer: FC = memo(() => {
  const { selectedViewItem } = useDashboardTemplates();

  return (
    <RowWrapperTitle
      boldTitle
      title     = 'Type элемента'
      toolTitle = 'Type элемента'
    >
      <Box sx={styleAtom}>{selectedViewItem?.type}</Box>
    </RowWrapperTitle>
  )
});
