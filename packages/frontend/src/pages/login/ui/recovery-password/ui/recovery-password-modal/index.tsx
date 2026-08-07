import { FC, memo, useRef } from 'react';
import { DialogInfo } from 'shared/ui/dialogs';
import { UseValue } from 'shared/lib/hooks';
import { RecoveryPasswordActions as Actions } from './actions';
import { RecoveryPasswordContent as Content } from './content';
import { useLogin } from '../../../../model/hooks';



interface Props {
  hookOpen: UseValue<any>
}


export const RecoveryPasswordModal: FC<Props> = memo(({ hookOpen: O }) => {
  const
    { setErrors } = useLogin(),
    emailRef = useRef(null);

  const handlerClose = () => {
    setErrors();
    O.setClose();
  };

  return (
    <DialogInfo
      hookOpen = {O}
      title    = 'Восстановление пароля'
      maxWidth = 'xs'
      onClose  = {handlerClose}
    >
      <Content emailRef={emailRef} />
      <Actions hookOpen={O} emailRef={emailRef} />
    </DialogInfo>
  )
});
