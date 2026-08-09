// packages/frontend/src/features/user/model/hooks/use-features-user/index.ts

import { useUserFeaturesStore } from '../../store';

export const useFeaturesUser = () => {
  const serviceUpdateUser = useUserFeaturesStore((s) => s.serviceUpdateUser);
  const serviceLogout = useUserFeaturesStore((s) => s.serviceLogout);

  return {
    serviceUpdateUser,
    serviceLogout,
  };
};
