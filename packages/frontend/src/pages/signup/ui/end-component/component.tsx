import { FC, memo, MutableRefObject } from 'react';
import { ActionMain } from 'shared/ui/pages/action-container';
import { TextFieldItem } from 'shared/ui/mui-components';
import { useSignup } from '../../model';
import { CodeAgainTimer } from './code-again-timer';
import Typography from '@mui/material/Typography';
import { f } from 'shared/styles';



interface Props {
  codeRef  : MutableRefObject<null>
  onSubmit : () => void
}


export const SignupEndPageComponent: FC<Props> = memo(({ codeRef, onSubmit }) => {
  const { loading, errors } = useSignup();

  return (
    <>
      <Typography sx={{ ...f('--c-w'), mb: 1, textAlign: 'center' }}>
        Введите код подтверждения отправленный на указанную Вами почту
      </Typography>

      <TextFieldItem
        name     = 'emailCode'
        ref      = {codeRef}
        scheme   = 'emailCode'
        errors   = {errors}
        onSubmit = {onSubmit}
      />

      <CodeAgainTimer />

      <ActionMain
        type     = 'signup'
        textBtn  = 'Подтвердить'
        loading  = {loading}
        errors   = {errors}
        onSubmit = {onSubmit}
      />
    </>
  )
});
