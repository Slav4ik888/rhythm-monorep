import { FC, memo, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import { RecoveryPasswordModal } from './recovery-password-modal';
import { useValue } from 'shared/lib/hooks';
import { useLogin } from '../../../model/hooks';



/** Восстановление пароля (главный контейнер) */
export const RecoveryPassword: FC = memo(() => {
  const
    { setErrors } = useLogin(),
    hookOpen = useValue();

  const handlerClick = useCallback(() => {
    setErrors();
    hookOpen.setOpen();
  }, [hookOpen, setErrors]);


  return (
    <>
      <Typography
        variant = 'body2'
        onClick = {handlerClick}
        sx      = {{
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        Восстановить пароль
      </Typography>

      <RecoveryPasswordModal hookOpen={hookOpen} />
    </>
  );
});
