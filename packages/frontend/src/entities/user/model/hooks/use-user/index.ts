// packages/frontend/src/entities/user/model/hooks/use-user/index.ts

import { useMemo } from 'react';
import { useUserStore } from '../../store';
import { Errors } from 'shared/lib/validators';
import type { ReqGetAuth } from '../../services';
import { getAuth } from '../../services';
import { api as axiosApi } from 'shared/api';
import { useAppDispatch } from 'shared/lib/hooks';

export const useUser = () => {
  const dispatch = useAppDispatch(); // Временно, для getAuth → errorHandlers/dispatch(actionsCompany)

  const _isLoaded = useUserStore((state) => state._isLoaded);
  const loading = useUserStore((state) => state.loading);
  const errors = useUserStore((state) => state.errors);

  const auth = useUserStore((state) => state.auth);
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const isVerified = user?.emailVerified;
  const email = user?.email;
  const role = user?.role;
  const companyId = user?.companyId;
  const isEditAccess = Boolean(user?.isEditAccess);
  const hintsDontShowAgain = user?.settings?.hintsDontShowAgain || [];

  const actions = useMemo(
    () => ({
      setErrors: (err: Errors) => useUserStore.getState().setErrors(err),
      clearErrors: () => useUserStore.getState().clearErrors(),
      serviceGetAuth: (data: ReqGetAuth) => getAuth(data, axiosApi, dispatch),
    }),
    [dispatch],
  );

  return {
    _isLoaded,
    loading,
    errors,

    auth,
    user,
    userId,
    isVerified,
    email,
    role,
    companyId,
    isEditAccess,
    hintsDontShowAgain,

    ...actions,
  };
};
