import { FC, memo } from 'react';
import { AppRoutes, LinkType, RoutePath } from 'app/providers/routes';
import { RenderFooterLinks } from '../render-footer-links';
import { f } from 'shared/styles';



export const FooterTopMiddleColumn: FC = memo(() => (
  <RenderFooterLinks
    links={
      [
        {
          name: 'Примеры дашбордов',
          route: RoutePath[AppRoutes.DEMO]
        },
      ] as LinkType[]
    }
    sx={{
      root: {
        ...f('c-fs-c'),
        height: '100%',
      }
    }}
  />
));
