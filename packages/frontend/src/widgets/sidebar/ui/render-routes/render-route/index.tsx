import { FC, memo } from 'react';
import { ColorName } from 'app/providers/theme';
import { SidebarListItem } from 'shared/types/sidebar';
import { SidebarLink } from '../../sidebar-items/sidebar-link';
import { SidebarNavLink } from '../../sidebar-items/sidebar-navlink';
import { SidebarTitle } from '../../sidebar-items/sidebar-title';
import { Divider } from 'shared/ui/mui-components';
import { getIconById } from 'shared/lib/icons';



interface Props {
  item          : SidebarListItem,
  activeSheetId : string, // текущий активный sheetId
  textColor     : ColorName
}


export const RenderRoute: FC<Props> = memo(({
  item: { type, href, title, iconId, id, noCollapse, route }, activeSheetId, textColor
}) => (
  <>
    {
      type === 'collapse' && (
        href
          ? (
            <SidebarLink
              href       = {href}
              title      = {title as string}
              icon       = {getIconById(iconId)}
              active     = {id === activeSheetId}
              noCollapse = {noCollapse}
            />
          )
          : (
            <SidebarNavLink
              id     = {id}
              route  = {route as string}
              title  = {title as string}
              icon   = {getIconById(iconId)}
              active = {id === activeSheetId}
            />
          )
      )
    }
    {
      type === 'title' && (
        <SidebarTitle
          textColor = {textColor}
          title     = {title as string}
        />
      )
    }
    {
      type === 'divider' && (
        <Divider />
      )
    }
  </>
));
