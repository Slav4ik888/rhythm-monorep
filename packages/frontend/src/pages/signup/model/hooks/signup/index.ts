import * as s from '../../selectors';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'shared/lib/hooks';
import { signupByEmailStart, signupByEmailEnd, signupSendCodeAgain } from '../../services';
import { SignupData, SignupDataEnd } from '../../types';
import { actions } from '../../slice';
import { Errors } from 'shared/lib/validators';
import { useMemo } from 'react';



export const useSignup = () => {
  const dispatch   = useAppDispatch();

  const loading    = useSelector(s.selectLoading);
  const errors     = useSelector(s.selectErrors);
  const signupData = useSelector(s.selectSignupData);
  const codeSended = useSelector(s.selectCodeSended);

  const api = useMemo(() => ({
    setErrors            : (errors: Errors) => dispatch(actions.setErrors(errors)),
    serviceSignupStart   : (data: SignupData) => dispatch(signupByEmailStart(data)),
    serviceSendCodeAgain : (data: SignupData) => dispatch(signupSendCodeAgain(data)),
    serviceSignupEnd     : (data: SignupDataEnd) => dispatch(signupByEmailEnd(data)),
  }), [dispatch]);


  return {
    loading,
    errors,
    signupData,
    codeSended,

    ...api
  }
};
