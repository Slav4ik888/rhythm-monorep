import { useTheme as useMuiTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DialogTitle } from '../../dialog-title';
import { UseBase } from 'shared/lib/hooks';
import { ReactNode } from 'react';
import { CustomTheme } from 'app/providers/theme';



interface Props {
  hookOpen    : UseBase
  maxWidth?   : 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  fullScreen? : boolean
  fullWidth?  : boolean
  title?      : string
  question?   : string
  sx?         : any
  children    : ReactNode
  onClose?    : () => void
}


/**
 * v.2025-06-21
 * Всплывающее окно с каким-то children
 */
export const DialogInfo: React.FC<Props> = ({
  title,
  children,
  question,
  hookOpen  : O,
  sx,
  maxWidth,
  fullWidth = true,
  fullScreen,
  onClose
}) => {
  const
    theme = useMuiTheme(),
    greaterSmScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const handlerClose = () => {
    if (onClose) return onClose()
    return O.setClose();
  };

  if (! O.open || ! children) return null;


  return (
    <Dialog
      open       = {O.open}
      maxWidth   = {maxWidth}
      fullScreen = {fullScreen}
      fullWidth  = {greaterSmScreen && fullWidth}
      onClose    = {handlerClose}
      sx         = {{
        '& .MuiDialog-paper': {
          width : { xs: '100%' },
          m     : { xs: 0 }
        },
        ...sx?.root
      }}

    >
      {
        title && <DialogTitle
          children = {title}
          question = {question}
          onClose  = {handlerClose}
        />
      }
      <DialogContent
        sx={(theme) => ({
          '&.MuiDialogContent-root': {
            backgroundColor: (theme as CustomTheme).palette.dialog.content.background,
            p: 4,
            ...sx?.content
          }
        })}
      >
        {
          children
        }
      </DialogContent>
    </Dialog>
  );
};
