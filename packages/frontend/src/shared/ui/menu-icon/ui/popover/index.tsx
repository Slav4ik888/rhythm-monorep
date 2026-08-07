import { FC, memo } from 'react';
import MuiPopover from '@mui/material/Popover';



type Props = {
  open     : boolean
  anchorEl : HTMLElement | null
  children : FC<{ open: boolean, onClose?: () => void }>
  onClose  : () => void
};


export const Popover: FC<Props> = memo(({ open, anchorEl, children: ChildrenComponent, onClose }) => (
  <MuiPopover
    open            = {open}
    anchorEl        = {anchorEl}
    anchorOrigin    = {{ vertical: 'bottom', horizontal: 'left' }}
    transformOrigin = {{ vertical: 'top',    horizontal: 'right' }}
    onClose         = {onClose}
  >
    <ChildrenComponent open={open} onClose={onClose} />
  </MuiPopover>
));
