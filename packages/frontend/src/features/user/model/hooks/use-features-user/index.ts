import { PartialUser } from 'entities/user';
import { useAppDispatch } from 'shared/lib/hooks';
import { logout, updateUser } from 'shared/api/features/user';



export const useFeaturesUser = () => {
  const dispatch = useAppDispatch();

  return {
    serviceUpdateUser : (user: PartialUser) => dispatch(updateUser(user)),
    serviceLogout     : () => dispatch(logout()),
  }
};
