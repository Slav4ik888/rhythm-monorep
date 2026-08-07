import { FC, memo } from 'react';
import { MDButton } from 'shared/ui/mui-design-components';
import { NavLink } from 'react-router-dom';
import { AppRoutes, RoutePath } from 'app/providers/routes';



export const GotoDemoBtn: FC = memo(() => (
  <NavLink to={RoutePath[AppRoutes.DEMO]}>
    <MDButton
      color    = 'primary'
      children = 'Посмотреть примеры дашбордов'
      sx       = {{
        root: {
          height: '50px'
        }
      }}
    />
  </NavLink>
));
