import { FC } from 'react';
import List from '@mui/material/List';
import { AddSheetBtn } from 'features/ui/sidebar';
import { RenderRoutes } from '../render-routes';
import { useDashboardViewState } from 'entities/dashboard-view';



export const SidebarList: FC = () => {
  const { editMode } = useDashboardViewState();


  return (
    <List>
      <RenderRoutes />
      {
        editMode && <AddSheetBtn />
      }
    </List>
  );
}
