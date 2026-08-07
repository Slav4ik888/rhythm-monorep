import { useAccess } from 'entities/company';
import { FC, memo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { useSidebar } from '../../model/hooks';
import { RenderRoute } from './render-route';



/** Render all the routes (All the visible items on the Sidebar) */
export const RenderRoutes: FC = memo(() => {
  const { sidebarRoutes, activeSheetId, textColor } = useSidebar();
  const { isDashboardAccessViewById } = useAccess();

  return (
    <>
      {
        sidebarRoutes.map(item => {
          if (! isDashboardAccessViewById(item.id)) return null;
          return <Fragment key={item.id}>
            <RenderRoute
              item          = {item}
              activeSheetId = {activeSheetId}
              textColor     = {textColor}
            />
          </Fragment>
        })
      }
    </>
  )
});
