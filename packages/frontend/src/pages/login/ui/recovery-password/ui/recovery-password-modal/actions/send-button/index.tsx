import { FC, memo, MutableRefObject, useEffect } from 'react';
import { UseValue } from 'shared/lib/hooks';
import { Button } from 'shared/ui/buttons';
import { validateRecoveryPassword } from '../../../../model/validators';
import { getRefValue } from 'shared/lib/refs';
import { useLogin } from '../../../../../../model/hooks';



interface Props {
  emailRef : MutableRefObject<null>
  hookOpen : UseValue<any>
}


export const RecoveryPasswordSendButton: FC<Props> = memo(({ hookOpen: O, emailRef }) => {
  const { loading, resetEmailResult, setResetEmailResult, serviceResetEmailPassword, setErrors } = useLogin();


  useEffect(() => {
    if (resetEmailResult) O.setClose()
    setResetEmailResult();
  },
    [O, resetEmailResult, loading, setResetEmailResult]
  );


  const handlerSend = () => {
    const
      email = getRefValue(emailRef),
      { valid, errors } = validateRecoveryPassword(email);

    if (valid) {
      serviceResetEmailPassword(email);
      setErrors();
    }
    else setErrors(errors);
  };


  return (
    <Button
      loading = {loading}
      text    = 'Отправить'
      onClick = {handlerSend}
    />
  )
});
