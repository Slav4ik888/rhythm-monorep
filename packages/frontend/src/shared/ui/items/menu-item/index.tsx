import { FC } from 'react';
import MuiMenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { CustomTheme } from 'app/providers/theme';



type Props = {
  icon    : JSX.Element
  route?  : string
  label   : string
  onClick : () => void
}

/** Кнопки в меню профилей с переключением на страницы */
export const MenuItem: FC<Props> = ({ label, icon, route = '', onClick }) => (
  <Link to={route} onClick={onClick}>
    <MuiMenuItem>
      <ListItemIcon
        sx={(theme) => ({
          '& svg, svg g': {
            color: (theme as CustomTheme).palette.navbar.color,
          }
        })}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary = {label}
        sx      = {(theme) => ({ color: (theme as CustomTheme).palette.navbar.contrastText })}
      />
    </MuiMenuItem>
  </Link>
);
