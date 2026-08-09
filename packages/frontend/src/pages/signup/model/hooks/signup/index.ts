// packages/frontend/src/pages/signup/model/hooks/signup/index.ts

import { useSignupPageStore } from '../../store';

export const useSignup = () => {
  const loading = useSignupPageStore((s) => s.loading);
  const errors = useSignupPageStore((s) => s.errors);
  const signupData = useSignupPageStore((s) => s.signupData);
  const codeSended = useSignupPageStore((s) => s.codeSended);

  const setErrors = useSignupPageStore((s) => s.setErrors);
  const serviceSignupStart = useSignupPageStore((s) => s.serviceSignupStart);
  const serviceSendCodeAgain = useSignupPageStore((s) => s.serviceSendCodeAgain);
  const serviceSignupEnd = useSignupPageStore((s) => s.serviceSignupEnd);

  return {
    loading,
    errors,
    signupData,
    codeSended,

    setErrors,
    serviceSignupStart,
    serviceSendCodeAgain,
    serviceSignupEnd,
  };
};
