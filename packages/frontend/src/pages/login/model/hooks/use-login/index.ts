// packages/frontend/src/pages/login/model/hooks/use-login/index.ts

import { useLoginPageStore } from '../../store';

export const useLogin = () => {
  const loading = useLoginPageStore((s) => s.loading);
  const resetEmailResult = useLoginPageStore((s) => s.resetEmailResult);
  const errors = useLoginPageStore((s) => s.errors);

  const setResetEmailResult = useLoginPageStore((s) => s.setResetEmailResult);
  const setErrors = useLoginPageStore((s) => s.setErrors);
  const serviceAuthByLogin = useLoginPageStore((s) => s.serviceAuthByLogin);
  const serviceResetEmailPassword = useLoginPageStore((s) => s.serviceResetEmailPassword);

  return {
    loading,
    resetEmailResult,
    setResetEmailResult,

    errors,
    setErrors,

    serviceAuthByLogin,
    serviceResetEmailPassword,
  };
};
