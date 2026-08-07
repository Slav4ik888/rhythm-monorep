import { FC, memo, MutableRefObject } from 'react';
import { useLogin } from '../../../../../model/hooks';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Box';
import TextField from '@mui/material/TextField';



const textStyle = {
  fontSize: {
    xs: '1rem'
  },
  my: {
    xs: 1,
    sm: 2
  }
};


interface Props {
  emailRef: MutableRefObject<unknown>
}


export const RecoveryPasswordContent: FC<Props> = memo(({ emailRef }) => {
  const { errors } = useLogin();


  return (
    <DialogContent sx={{ '&.MuiDialogContent-root': { p: 0 } }}>
      <Typography sx={textStyle}>
        Введите ваш email, мы отправим на него ссылку для восстановления пароля.
      </Typography>

      <TextField
        fullWidth
        name       = 'email'
        type       = 'email'
        label      = 'Введите email'
        inputRef   = {emailRef}
        helperText = {errors?.email}
        error      = {errors?.email ? true : false}
        sx         = {textStyle}
      />
    </DialogContent>
  )
});
