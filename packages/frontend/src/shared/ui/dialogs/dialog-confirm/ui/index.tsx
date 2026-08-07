import { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, ButtonType } from '../../../buttons';



export enum ConfirmType {
  DEL           = 'Удалить',
  SAVE          = 'Сохранить',
  WITHOUT_SAVE  = 'Не сохранять',
  NO_QUESTIONS  = 'Понятно',
  ADD_TO_COURSE = 'Добавить'
}


type Props = {
  typeOk   : ConfirmType
  open     : boolean
  title    : string
  onOk     : () => void
  onCancel : () => void
}


/** 2023-10-30 */
export const DialogConfirm: FC<Props> = ({ open, typeOk, title, onOk, onCancel }) => (
    <Dialog
      open={open}
      maxWidth='xs'
      sx={{
        p: 2,
        '& .MuiPaper-root': {
          margin  : { xs: 0 },
          padding : { xs: 0 }
        }
      }}
      onClose={onCancel}
    >
      <DialogTitle sx={{ p: { xs: 2, sm: 4 } }}>
        {title}
      </DialogTitle>

      <DialogActions sx={{ p: { xs: 2, sm: 4 } }}>
        {
          typeOk !== ConfirmType.NO_QUESTIONS
            && <Button
              text    = 'Отменить'
              type    = {ButtonType.SECONDARY}
              sx      = {{ root: { mr: 2 } }}
              onClick = {onCancel}
            />
        }
        <Button
          text    = {typeOk}
          variant = 'outlined'
          onClick = {onOk}
        />
      </DialogActions>
    </Dialog>
  );
