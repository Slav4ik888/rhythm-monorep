/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { FC } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Icon from '@mui/material/Icon';
import MDBox from 'shared/ui/mui-design-components/md-box';
import {
  collapseItem,
  collapseIconBox,
  collapseIcon,
  collapseText,
} from './styles';
import { CustomTheme, useUIConfiguratorController } from 'app/providers/theme';
import { Tooltip } from 'shared/ui/tooltip';
import { NO_SHEET_ID, useDashboardViewState } from 'entities/dashboard-view';
import { useHover } from 'shared/lib/hooks';
import { EditSheetBtn } from 'features/ui/sidebar';



interface Props {
  id?         : string
  icon        : MuiIcon | string
  title       : string
  active      : boolean // является ли активным
  noCollapse? : boolean
}


export const SidebarCollapse: FC<Props> = ({ id, icon: IconComponent, title, active, ...rest }) => {
  const [configuratorState] = useUIConfiguratorController();
  const { sidebarMini, isMobileOpenSidebar } = configuratorState;
  const { editMode } = useDashboardViewState();
  const { isHover, isEdit, hoverBind, onSetEdit } = useHover();


  return (
    <ListItem
      {...hoverBind}
      component = 'li'
      sx        = {{ position: 'relative' }}
    >
      <MDBox
        {...rest}
        sx={(theme: CustomTheme) => collapseItem(theme, { active })}
      >
        <ListItemIcon sx={(theme) => collapseIconBox(theme as CustomTheme, { active })}>
          {
            typeof IconComponent === 'string'
              ? <Icon sx={(theme) => collapseIcon(theme as CustomTheme, { active })}>{IconComponent}</Icon>
              : <IconComponent />
          }
        </ListItemIcon>

        <Tooltip
          title  = {title}
          sxSpan = {{ cursor: 'pointer' }}
        >
          <ListItemText
            primary={title}
            sx={(theme) => collapseText(theme as CustomTheme, { active, sidebarMini, isMobileOpenSidebar })}
          />
        </Tooltip>
      </MDBox>
      {
        ((editMode && isHover) || (editMode && isEdit)) && id && id !== NO_SHEET_ID && (
          <EditSheetBtn
            editId    = {id}
            isHover   = {isHover}
            isEdit    = {isEdit}
            onSetEdit = {onSetEdit}
          />
        )
      }
    </ListItem>
  );
}
