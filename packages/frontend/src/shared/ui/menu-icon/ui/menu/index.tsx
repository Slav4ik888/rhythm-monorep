import { FC, ReactNode, memo } from 'react';
import MuiMenu from '@mui/material/Menu';
import { CustomTheme } from 'app/providers/theme';



type Props = {
  open     : boolean
  anchorEl : HTMLElement | null
  children : ReactNode
  onClose  : () => void
};


export const Menu: FC<Props> = memo(({ open, anchorEl, children, onClose }) => (
  <MuiMenu
    keepMounted
    open            = {open}
    anchorEl        = {anchorEl}
    anchorOrigin    = {{ vertical: 'top', horizontal: 'right' }}
    transformOrigin = {{ vertical: 'top', horizontal: 'right' }}
    onClose         = {onClose}
    slotProps       = {{
      paper: {
        sx: {
          backgroundColor: (theme) => (theme as CustomTheme).palette.navbar.bg
        }
      }
    }}
  >
    {
      children
    }
  </MuiMenu>
));
