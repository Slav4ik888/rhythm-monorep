import { FC, memo, MutableRefObject } from 'react';
import { useLogin } from '../../../../../model/hooks';
import DialogActions from '@mui/material/DialogActions';
import { ErrorBox } from 'shared/ui/containers';
import { UseValue } from 'shared/lib/hooks';
import { RecoveryPasswordSendButton as SendButton } from './send-button';
import { f } from 'shared/styles';



interface Props {
  emailRef: MutableRefObject<null>
  hookOpen: UseValue<any>
}


export const RecoveryPasswordActions: FC<Props> = memo(({ hookOpen: O, emailRef }) => {
  const { errors } = useLogin();


  return (
    <DialogActions sx={{ ...f('c'), p  : 0, mt : 2 }}>
      <ErrorBox
        field  = 'general'
        errors = {errors}
        sx     = {{
          root: {
            mt: 1
          }
        }}
      />
      <SendButton hookOpen={O} emailRef={emailRef} />
    </DialogActions>
  )
});
