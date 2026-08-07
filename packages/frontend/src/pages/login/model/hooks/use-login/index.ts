import * as s from '../../selectors';
import { actions as a } from '../../slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { AuthByLogin, authByLogin, resetEmailPassword } from '../../services';
import { Errors } from 'shared/lib/validators';



export const useLogin = () => {
  const
    dispatch   = useAppDispatch(),

    loading    = useSelector(s.selectLoading),
    resetEmailResult = useSelector(s.selectResetEmailResult),
    setResetEmailResult = (result?: boolean | undefined) => dispatch(a.setResetEmailResult(result)),

    errors     = useSelector(s.selectErrors),
    setErrors  = (errors?: Errors | undefined) => dispatch(a.setErrors(errors)),

    serviceAuthByLogin        = (data: AuthByLogin) => dispatch(authByLogin(data)),
    serviceResetEmailPassword = (email: string)     => dispatch(resetEmailPassword(email));

  return {
    loading,
    resetEmailResult,
    setResetEmailResult,

    errors,
    setErrors,

    serviceAuthByLogin,
    serviceResetEmailPassword
  }
};
